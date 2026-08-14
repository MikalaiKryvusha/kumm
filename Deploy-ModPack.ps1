<#
.SYNOPSIS
    Deploys the Palworld mod library described by modpack.json into one or more game folders.

.DESCRIPTION
    Mods stay in this library folder as the archives you downloaded from Nexus
    (or as plain folders under _unpacked\). This script unpacks them into a
    temp folder and copies each one to its correct place inside the game.

    Run it with no arguments for the interactive menu: pick targets, deploy,
    verify, remove, add a freshly downloaded game build. Pass an action switch
    instead to run one shot and exit (scriptable, sets exit code 1 on trouble).

    Which game folders can be built comes from targets.json in this folder.
    There can be one target, or two while you migrate from one game version to
    the next, or any number. -GameDir overrides the file for a one-off build.

    Each archive is unpacked once per action and reused across every target.
    A deploy verifies itself when it finishes (-NoVerify to skip).

    Engine.ini lives in %LOCALAPPDATA% and is shared by every install on this
    PC, so it is written once per action, never once per target.

    steam_emu.ini (game language) is per-target and is written on every deploy,
    both in the working tree and in _crack\ - see "steamEmu" in the manifest.

.EXAMPLE
    .\Deploy-PalworldMods.ps1                                    # interactive menu
    .\Deploy-PalworldMods.ps1 -ListTargets
    .\Deploy-PalworldMods.ps1 -ListMods
    .\Deploy-PalworldMods.ps1 -Deploy -DryRun
    .\Deploy-PalworldMods.ps1 -Deploy
    .\Deploy-PalworldMods.ps1 -Deploy -Targets 1.0.3
    .\Deploy-PalworldMods.ps1 -Deploy -GameDir "D:\Games\Palworld-1.0.3"
    .\Deploy-PalworldMods.ps1 -Deploy -WithEngineIni
    .\Deploy-PalworldMods.ps1 -Verify
    .\Deploy-PalworldMods.ps1 -Remove -Targets 1.0.2
    .\Deploy-PalworldMods.ps1 -Deploy -Only UE4SS,DeclutterHUD
#>
[CmdletBinding()]
param(
    [switch]$Interactive,
    [switch]$Deploy,
    [switch]$Verify,
    [switch]$Remove,
    [switch]$ListMods,
    [switch]$ListTargets,
    [string[]]$GameDir,
    [string[]]$Targets,
    [string[]]$Only,
    [string]$PackDir,
    [string]$TargetsFile,
    [string]$Manifest,
    [string]$ModsDir,
    [switch]$WithEngineIni,
    [switch]$IncludeDisabled,
    [switch]$NoVerify,
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

# RootDir = the pack: modpack.json, targets.json, _config\, and the mod library.
# ModsDir = the library inside it: downloaded archives and _unpacked\, named by
# "library" in the manifest.
#
# The engine and the pack live apart: this script ships with KUMM, while a pack
# is somebody's private collection somewhere else. -PackDir points at that folder;
# with no -PackDir the script falls back to its own directory, which is how a
# self-contained pack used to work. Имя параметра НЕ -Pack: в PowerShell имена
# переменных регистронезависимы, а $pack ниже держит разобранный манифест -
# параметр [string] молча привёл бы объект к строке.
$RootDir = if ($PackDir) { (Resolve-Path $PackDir).Path } else { $PSScriptRoot }
if (-not (Test-Path $RootDir)) { throw "pack folder not found: $RootDir" }
if (-not $Manifest)    { $Manifest    = Join-Path $RootDir 'modpack.json' }
if (-not $TargetsFile) { $TargetsFile = Join-Path $RootDir 'targets.json' }

# Game executable used to sanity-check a target folder. Manifest may override it.
$GameExe = 'Pal\Binaries\Win64\Palworld-Win64-Shipping.exe'

function Say  ($m, $c = 'Gray') { Write-Host $m -ForegroundColor $c }
function Head ($m) { Write-Host "`n--- $m" -ForegroundColor Cyan }
function Ok   ($m) { Write-Host "  [ok]   $m" -ForegroundColor Green }
function Warn ($m) { Write-Host "  [warn] $m" -ForegroundColor Yellow }
function Bad  ($m) { Write-Host "  [FAIL] $m" -ForegroundColor Red }

function Resolve-UnderRoot {
    param([string]$Path)
    if ([System.IO.Path]::IsPathRooted($Path)) { return $Path.TrimEnd('\') }
    return (Join-Path $RootDir ($Path -replace '/', '\')).TrimEnd('\')
}

# ------------------------------------------------------------------ manifest
if (-not (Test-Path $Manifest)) { throw "Manifest not found: $Manifest" }
$pack = Get-Content $Manifest -Raw -Encoding UTF8 | ConvertFrom-Json

# A pack for another game says so itself; without the key we stay on Palworld.
if ($pack.gameExe) { $GameExe = ($pack.gameExe -replace '/', '\') }

if ($ModsDir)          { $ModsDir = Resolve-UnderRoot $ModsDir }
elseif ($pack.library) { $ModsDir = Resolve-UnderRoot $pack.library }
elseif (Test-Path (Join-Path $RootDir 'mods')) { $ModsDir = Join-Path $RootDir 'mods' }
else                   { $ModsDir = $RootDir }   # flat layout, pre-mods\ libraries

if (-not (Test-Path $ModsDir)) {
    throw "Mod library folder not found: $ModsDir`n" +
          "It is set by `"library`" in $([System.IO.Path]::GetFileName($Manifest)); override with -ModsDir <path>."
}
$ModsDir = (Resolve-Path $ModsDir).Path

function Show-Mods {
    Say "$($pack.packName)  --  built for $($pack.builtFor)`n" Cyan
    $i = 0
    foreach ($m in $pack.mods) {
        $i++
        $state = if ($null -ne $m.enabled -and -not $m.enabled) { 'disabled' } else { 'enabled ' }
        $picked = if ($script:OnlyMods) { if ($script:OnlyMods -contains $m.name) { '*' } else { ' ' } } else { ' ' }
        '{0,3}. {1} {2}  {3,-30} {4,-8} {5}' -f $i, $picked, $state, $m.name, $m.kind, $m.version | Write-Host
        if ($m.note) { Write-Host "               note: $($m.note)" -ForegroundColor DarkYellow }
    }
    if ($script:OnlyMods) { Say "`n* = in the current -Only subset" DarkYellow }
}

function Select-Mods {
    param([switch]$Quiet)
    $sel = @()
    foreach ($m in $pack.mods) {
        if ($script:OnlyMods -and ($script:OnlyMods -notcontains $m.name)) { continue }
        $disabled = ($null -ne $m.enabled -and -not $m.enabled)
        if ($disabled -and -not $IncludeDisabled -and -not $script:OnlyMods) {
            if (-not $Quiet) {
                Warn "$($m.name): skipped (disabled in manifest)"
                if ($m.note) { Write-Host "         $($m.note)" -ForegroundColor DarkYellow }
            }
            continue
        }
        $sel += $m
    }
    return $sel
}

# ------------------------------------------------------------------- targets
function Expand-TargetPath {
    param([string]$Path)
    $p = [Environment]::ExpandEnvironmentVariables($Path.Trim().Trim('"')) -replace '/', '\'
    if (-not [System.IO.Path]::IsPathRooted($p)) { $p = Join-Path $RootDir $p }
    return $p.TrimEnd('\')
}

function Test-GameRoot {
    param([string]$Path)
    if (-not $Path) { return $false }
    return (Test-Path (Join-Path $Path $GameExe))
}

function Get-TargetState {
    param($Target)
    if ($Target.Disabled)                 { return 'disabled' }
    if (-not (Test-Path $Target.Path))    { return 'MISSING' }
    if (-not (Test-GameRoot $Target.Path)) { return 'NOT PAL' }
    return 'ok'
}

function Read-TargetsFile {
    # returns every entry in the file, disabled ones included
    if (-not (Test-Path $TargetsFile)) { return @() }
    $cfg = Get-Content $TargetsFile -Raw -Encoding UTF8 | ConvertFrom-Json
    if (-not $cfg.targets) { return @() }
    $out = @()
    foreach ($t in $cfg.targets) {
        if (-not $t.path) { Warn "target entry without 'path' - skipped"; continue }
        $path = Expand-TargetPath $t.path
        $out += [pscustomobject]@{
            Name     = $(if ($t.name) { $t.name } else { Split-Path $path -Leaf })
            Path     = $path
            Raw      = $t.path
            Note     = $t.note
            Disabled = ($null -ne $t.enabled -and -not $t.enabled)
        }
    }
    return $out
}

function ConvertTo-JsonString {
    param([string]$s)
    if ($null -eq $s) { return '' }
    return $s.Replace('\', '\\').Replace('"', '\"').Replace("`r", '\r').Replace("`n", '\n').Replace("`t", '\t')
}

function Save-TargetsFile {
    # hand-rolled so Cyrillic notes stay readable (ConvertTo-Json escapes them to \uXXXX)
    param($Entries)
    $lines = @()
    $lines += '{'
    $lines += '  "$comment": "Game folders this library deploys into. Used by Deploy-PalworldMods.ps1 when -GameDir is not given. Add an entry per install; \"enabled\": false parks one without deleting it.",'
    $lines += '  "targets": ['
    for ($i = 0; $i -lt $Entries.Count; $i++) {
        $e = $Entries[$i]
        $body = @()
        $body += '      "name": "{0}"' -f (ConvertTo-JsonString $e.Name)
        $body += '      "path": "{0}"' -f (ConvertTo-JsonString $(if ($e.Raw) { $e.Raw } else { $e.Path }))
        if ($e.Disabled)  { $body += '      "enabled": false' }
        if ($e.Note)      { $body += '      "note": "{0}"' -f (ConvertTo-JsonString $e.Note) }
        $lines += '    {'
        $lines += ($body -join ",`r`n")
        $lines += $(if ($i -lt $Entries.Count - 1) { '    },' } else { '    }' })
    }
    $lines += '  ]'
    $lines += '}'
    $text = ($lines -join "`r`n") + "`r`n"
    [System.IO.File]::WriteAllText($TargetsFile, $text, (New-Object System.Text.UTF8Encoding($false)))
}

function Get-BatchTargets {
    # target list for one-shot (non-interactive) runs
    if ($GameDir) {
        return @(foreach ($g in $GameDir) {
            $p = Expand-TargetPath $g
            [pscustomobject]@{ Name = (Split-Path $p -Leaf); Path = $p; Raw = $g; Note = $null; Disabled = $false }
        })
    }
    if (-not (Test-Path $TargetsFile)) {
        throw "No -GameDir given and no targets file: $TargetsFile`n" +
              "Run the script with no arguments and press '+' to add a game folder, or pass -GameDir <path>."
    }
    $all = @(Read-TargetsFile)
    if (-not $all) { throw "No usable entries in $TargetsFile" }

    $out = @()
    foreach ($t in $all) {
        if ($Targets -and ($Targets -notcontains $t.Name)) { continue }
        if ($t.Disabled -and -not $Targets) {
            Warn "$($t.Name): skipped (disabled in targets.json)"
            if ($t.Note) { Say "         $($t.Note)" DarkYellow }
            continue
        }
        $out += $t
    }
    if ($Targets) {
        foreach ($want in $Targets) {
            if ($out.Name -notcontains $want) { Warn "no target named '$want' in $TargetsFile" }
        }
    }
    return $out
}

function Split-Usable {
    # -> @{ Live = <valid targets>; Broken = <why-strings> }
    param($TargetList)
    $live = @(); $broken = @()
    foreach ($t in $TargetList) {
        if (-not (Test-Path $t.Path))      { $broken += "$($t.Name): folder not found - $($t.Path)"; continue }
        if (-not (Test-GameRoot $t.Path))  { $broken += "$($t.Name): not a Palworld install (no $GameExe) - $($t.Path)"; continue }
        $t.Path = (Resolve-Path $t.Path).Path
        $live += $t
    }
    return @{ Live = $live; Broken = $broken }
}

# ------------------------------------------------------------------- sources
$script:TempRoot = $null
$script:SourceCache = @{}

function Get-TempRoot {
    if (-not $script:TempRoot) {
        $script:TempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("palmods_" + [guid]::NewGuid().ToString('N').Substring(0, 8))
        New-Item -ItemType Directory -Path $script:TempRoot -Force | Out-Null
    }
    return $script:TempRoot
}

function Clear-Sources {
    if ($script:TempRoot -and (Test-Path $script:TempRoot)) {
        Remove-Item $script:TempRoot -Recurse -Force -ErrorAction SilentlyContinue
    }
    $script:TempRoot = $null
    $script:SourceCache = @{}
}

function Resolve-ModSource {
    param($Mod)
    # unpack once per action, then reuse for every target
    if ($script:SourceCache.ContainsKey($Mod.name)) { return $script:SourceCache[$Mod.name] }

    if ($Mod.source.folder) {
        $p = Join-Path $ModsDir ($Mod.source.folder -replace '/', '\')
        if (-not (Test-Path $p)) { throw "source folder missing: $($Mod.source.folder) (looked in $ModsDir)" }
        $res = [pscustomobject]@{ Path = $p; Archive = $null }
    }
    else {
        $hits = @(Get-ChildItem -Path $ModsDir -Filter $Mod.source.archive -File |
                  Sort-Object LastWriteTime -Descending)
        if ($hits.Count -eq 0) { throw "no archive matching '$($Mod.source.archive)' in $ModsDir" }
        if ($hits.Count -gt 1) { Warn "$($Mod.name): $($hits.Count) archives match, using newest -> $($hits[0].Name)" }

        $dest = Join-Path (Get-TempRoot) $Mod.name
        if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
        New-Item -ItemType Directory -Path $dest -Force | Out-Null
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        [System.IO.Compression.ZipFile]::ExtractToDirectory($hits[0].FullName, $dest)
        $res = [pscustomobject]@{ Path = $dest; Archive = $hits[0].Name }
    }
    $script:SourceCache[$Mod.name] = $res
    return $res
}

function Copy-Tree {
    param([string]$From, [string]$To)
    if (Test-Path $From -PathType Leaf) {
        $parent = Split-Path $To -Parent
        if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
        Copy-Item $From $To -Force
        return 1
    }
    $n = 0
    $root = (Resolve-Path $From).Path
    foreach ($f in Get-ChildItem $root -Recurse -File) {
        $rel = $f.FullName.Substring($root.Length).TrimStart('\')
        $dst = Join-Path $To $rel
        $parent = Split-Path $dst -Parent
        if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
        Copy-Item $f.FullName $dst -Force
        $n++
    }
    return $n
}

# ------------------------------------------------------------ mod userConfig
# A mod can own a file in %LOCALAPPDATA%\Pal\Saved\Config\ - the last layer of the
# config hierarchy, so it wins over anything a pak carries. Shared by every install
# on this PC, so it is written once per action however many targets are selected.

function Get-UserConfigTarget {
    param($Mod)
    return [Environment]::ExpandEnvironmentVariables(($Mod.userConfig.target -replace '/', '\'))
}

function Write-UserConfig {
    param($Mod, [switch]$Plan)
    $target = Get-UserConfigTarget -Mod $Mod
    if ($script:WroteUserConfig -contains $target) { return }

    $srcPath = Resolve-UnderRoot $Mod.userConfig.file
    if (-not (Test-Path $srcPath)) { throw "userConfig.file not found: $srcPath" }
    $text = [System.IO.File]::ReadAllText($srcPath)

    if ($Plan) {
        Say "  would write $target  ($($text.Length) chars, read-only=$($Mod.userConfig.setReadOnly))" DarkGray
        $script:WroteUserConfig += $target
        return
    }
    $dir = Split-Path $target -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    if (Test-Path $target) { $i = Get-Item $target; if ($i.IsReadOnly) { $i.IsReadOnly = $false } }
    [System.IO.File]::WriteAllText($target, $text, (New-Object System.Text.UTF8Encoding($false)))
    if ($Mod.userConfig.setReadOnly) { (Get-Item $target).IsReadOnly = $true }
    $script:WroteUserConfig += $target
    Ok "$($Mod.name): $target (read-only: $([bool]$Mod.userConfig.setReadOnly))"
}

function Test-UserConfig {
    <# The game blanks these files on every run unless they are read-only, so a
       size/mtime check would not catch it - compare the text. #>
    param($Mod)
    $target = Get-UserConfigTarget -Mod $Mod
    $srcPath = Resolve-UnderRoot $Mod.userConfig.file
    if (-not (Test-Path $target)) { Bad "$($Mod.name): $target missing"; return $false }
    $want = [System.IO.File]::ReadAllText($srcPath)
    $have = [System.IO.File]::ReadAllText($target)
    if ($want -cne $have) { Bad "$($Mod.name): $target does not match $($Mod.userConfig.file)"; return $false }
    if ($Mod.userConfig.setReadOnly -and -not (Get-Item $target).IsReadOnly) {
        Warn "$($Mod.name): $target is not read-only - the game will blank it on next run"
        return $false
    }
    Ok "$($Mod.name): $target"
    return $true
}

function Remove-UserConfig {
    param($Mod, [switch]$Plan)
    $target = Get-UserConfigTarget -Mod $Mod
    if (-not (Test-Path $target)) { return 0 }
    if ($script:WroteUserConfig -contains $target) { return 0 }
    if ($Plan) { Say "  would delete $target" DarkGray }
    else {
        $i = Get-Item $target
        if ($i.IsReadOnly) { $i.IsReadOnly = $false }
        Remove-Item $target -Force
        Ok "deleted $target"
    }
    $script:WroteUserConfig += $target
    return 1
}

# ------------------------------------------------------------- steam_emu.ini
# Palworld has no language switch of its own - it asks the platform, and on a
# repack the platform is the Steam emulator. The file belongs to the build, not
# to any mod, but a fresh build arrives set to english and the crack lays its
# own copy down from _crack\, so both copies are kept in step on every deploy.

function Resolve-SteamEmuFiles {
    param($Target)
    $out = @()
    foreach ($rel in $pack.steamEmu.files) {
        $path = Join-Path $Target.Path ($rel -replace '/', '\')
        if (-not (Test-Path $path)) {
            # Steamworks version can change between builds - fall back to a search,
            # keeping the working tree and the _crack\ copy apart.
            $wantCrack = ($rel -replace '/', '\') -like '_crack\*'
            $hit = @(Get-ChildItem -Path $Target.Path -Filter (Split-Path $rel -Leaf) -File -Recurse -ErrorAction SilentlyContinue |
                     Where-Object { ($_.FullName -like '*\_crack\*') -eq $wantCrack } |
                     Select-Object -First 1)
            if (-not $hit) { $out += [pscustomobject]@{ Rel = $rel; Path = $null }; continue }
            $path = $hit[0].FullName
        }
        $out += [pscustomobject]@{ Rel = $rel; Path = $path }
    }
    return $out
}

function Set-SteamEmu {
    param($Target, [switch]$Plan)
    if (-not $pack.steamEmu) { return }
    $pairs = @($pack.steamEmu.set.PSObject.Properties)
    if (-not $pairs) { return }
    $section = $pack.steamEmu.section
    if (-not $section) { $section = 'Settings' }
    $utf8 = New-Object System.Text.UTF8Encoding($false)

    foreach ($f in (Resolve-SteamEmuFiles -Target $Target)) {
        if (-not $f.Path) { Warn "steam_emu: not found, skipped - $($f.Rel)"; continue }
        $shown = $f.Path.Substring($Target.Path.Length).TrimStart('\')

        $raw = [System.IO.File]::ReadAllText($f.Path, $utf8)
        $endsWithNewline = $raw -match "`n$"
        $lines = [System.Collections.Generic.List[string]]($raw -split "`r?`n")
        if ($endsWithNewline -and $lines.Count -gt 0) { $lines.RemoveAt($lines.Count - 1) }

        $cur = ''; $header = -1; $dirty = @(); $seen = @{}
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match '^\s*\[(.+?)\]\s*$') {
                $cur = $Matches[1]
                if ($cur -eq $section) { $header = $i }
                continue
            }
            if ($cur -ne $section) { continue }
            if ($lines[$i] -notmatch '^\s*([A-Za-z0-9_]+)\s*=') { continue }   # leaves #commented keys alone
            $key = $Matches[1]
            $want = $pairs | Where-Object { $_.Name -eq $key }
            if (-not $want) { continue }
            $seen[$key] = $true
            $new = "$key=$($want.Value)"
            if ($lines[$i] -cne $new) { $dirty += "$key -> $($want.Value)"; $lines[$i] = $new }
        }

        if ($header -lt 0) { Warn "steam_emu: no [$section] section in $shown, skipped"; continue }
        foreach ($p in $pairs) {
            if ($seen[$p.Name]) { continue }
            $lines.Insert($header + 1, "$($p.Name)=$($p.Value)")
            $dirty += "$($p.Name) -> $($p.Value) (added)"
        }

        if (-not $dirty) { Ok "steam_emu: already set in $shown"; continue }
        if ($Plan) { Say "  would set $($dirty -join ', ')  in $shown" DarkGray; continue }

        $item = Get-Item $f.Path
        $wasReadOnly = $item.IsReadOnly
        if ($wasReadOnly) { $item.IsReadOnly = $false }
        $text = ($lines -join "`r`n")
        if ($endsWithNewline) { $text += "`r`n" }
        [System.IO.File]::WriteAllText($f.Path, $text, $utf8)
        if ($wasReadOnly) { (Get-Item $f.Path).IsReadOnly = $true }
        Ok "steam_emu: $($dirty -join ', ')  in $shown"
    }
}

function Test-SteamEmu {
    <# Returns @{ Present; Missing } so verify counts it like any other file. #>
    param($Target)
    $present = 0; $missing = 0
    if (-not $pack.steamEmu) { return [pscustomobject]@{ Present = 0; Missing = 0 } }
    $pairs = @($pack.steamEmu.set.PSObject.Properties)
    $section = $pack.steamEmu.section
    if (-not $section) { $section = 'Settings' }

    foreach ($f in (Resolve-SteamEmuFiles -Target $Target)) {
        if (-not $f.Path) { Bad "steam_emu: not found - $($f.Rel)"; $missing++; continue }
        $shown = $f.Path.Substring($Target.Path.Length).TrimStart('\')
        $cur = ''; $found = @{}
        foreach ($line in [System.IO.File]::ReadAllLines($f.Path)) {
            if ($line -match '^\s*\[(.+?)\]\s*$') { $cur = $Matches[1]; continue }
            if ($cur -ne $section) { continue }
            if ($line -match '^\s*([A-Za-z0-9_]+)\s*=(.*)$') { $found[$Matches[1]] = $Matches[2].Trim() }
        }
        foreach ($p in $pairs) {
            if ($found[$p.Name] -ceq [string]$p.Value) { Ok "steam_emu: $($p.Name)=$($p.Value)  ($shown)"; $present++ }
            else { Bad "steam_emu: $($p.Name)=$($found[$p.Name]), expected $($p.Value)  ($shown)"; $missing++ }
        }
    }
    return [pscustomobject]@{ Present = $present; Missing = $missing }
}

# ------------------------------------------------------------ per-target ops
function Invoke-VerifyTarget {
    param($Target)
    $missing = 0; $present = 0
    foreach ($m in $pack.mods) {
        # userConfig lives in %LOCALAPPDATA% and is shared - check it once per action
        if ($m.userConfig -and ($null -eq $m.enabled -or $m.enabled)) {
            $t = Get-UserConfigTarget -Mod $m
            if ($script:CheckedUserConfig -notcontains $t) {
                $script:CheckedUserConfig += $t
                if (Test-UserConfig -Mod $m) { $present++ } else { $missing++ }
            }
        }
        foreach ($v in $m.verify) {
            $p = Join-Path $Target.Path ($v -replace '/', '\')
            if (Test-Path $p) { Ok "$($m.name): $v"; $present++ }
            else {
                $disabled = ($null -ne $m.enabled -and -not $m.enabled)
                if ($disabled) { Say "  [--]   $($m.name): $v (disabled, expected absent)" DarkGray }
                else { Bad "$($m.name): $v"; $missing++ }
            }
        }
    }
    $emu = Test-SteamEmu -Target $Target
    $present += $emu.Present; $missing += $emu.Missing
    return [pscustomobject]@{ Present = $present; Missing = $missing }
}

function Invoke-RemoveTarget {
    param($Target, $Mods, [switch]$Plan)
    $n = 0
    foreach ($m in $Mods) {
        foreach ($step in $m.install) {
            $path = Join-Path $Target.Path ($step.to -replace '/', '\')
            if (Test-Path $path) {
                if ($Plan) { Say "  would delete $($step.to)" DarkGray }
                else { Remove-Item $path -Recurse -Force; Ok "deleted $($step.to)" }
                $n++
            }
        }
        if ($m.userConfig) { $n += Remove-UserConfig -Mod $m -Plan:$Plan }
    }
    $modsRoot = Join-Path $Target.Path 'Pal\Content\Paks\~mods'
    if ((Test-Path $modsRoot) -and -not (Get-ChildItem $modsRoot -Force)) {
        if (-not $Plan) { Remove-Item $modsRoot -Force }
    }
    return $n
}

function Invoke-DeployTarget {
    param($Target, $Mods, [switch]$Plan)
    $failed = @(); $files = 0; $installed = 0
    foreach ($m in $Mods) {
        try {
            $src = Resolve-ModSource -Mod $m
            $total = 0
            foreach ($step in $m.install) {
                $from = if ($step.from -eq '.') { $src.Path } else { Join-Path $src.Path ($step.from -replace '/', '\') }
                if (-not (Test-Path $from)) { throw "archive layout changed - '$($step.from)' not found" }
                $to = Join-Path $Target.Path ($step.to -replace '/', '\')
                if ($Plan) { Say "  would copy $($step.from)  ->  $($step.to)" DarkGray }
                else { $total += Copy-Tree -From $from -To $to }
            }
            if ($m.userConfig) { Write-UserConfig -Mod $m -Plan:$Plan }
            $installed++
            $files += $total
            if ($Plan) { Ok "$($m.name) $($m.version)" }
            else { Ok "$($m.name) $($m.version)  ($total files)" }
        }
        catch {
            Bad "$($m.name): $($_.Exception.Message)"
            $failed += $m.name
        }
    }

    # official mod support toggle - the game writes this itself, but seed it anyway
    $palModSettings = Join-Path $Target.Path 'Mods\PalModSettings.ini'
    if (-not (Test-Path $palModSettings) -and -not $Plan) {
        New-Item -ItemType Directory -Path (Split-Path $palModSettings -Parent) -Force | Out-Null
        @('[PalModSettings]', 'bGlobalEnableMod=True', 'WorkshopRootDir=', 'ConfigVersion=1.0') |
            Set-Content -Path $palModSettings -Encoding ASCII
        Ok "Mods\PalModSettings.ini (bGlobalEnableMod=True)"
    }

    # game language - belongs to the build, but a fresh build ships english
    try { Set-SteamEmu -Target $Target -Plan:$Plan }
    catch { Bad "steam_emu: $($_.Exception.Message)"; $failed += 'steam_emu.ini' }

    return [pscustomobject]@{ Installed = $installed; Files = $files; Failed = $failed }
}

# ---------------------------------------------------------------- Engine.ini
function Write-EngineIni {
    param([switch]$Plan)
    Head 'Engine.ini (shared by every Palworld install on this PC)'
    $target = [Environment]::ExpandEnvironmentVariables(($pack.engineIni.target -replace '/', '\'))

    # engineIni.file - файл сборки копируется как есть, байт в байт. Так и
    # надо, когда Engine.ini давно перерос "база с Nexus + добавка": в нём
    # живут DX12, привязка консоли, фиксы зависаний и русские комментарии,
    # которых ни в какой базе нет, а пересборка их молча стирает.
    if ($pack.engineIni.file) {
        $srcIni = Resolve-UnderRoot $pack.engineIni.file
        if (-not (Test-Path $srcIni)) { throw "engineIni.file not found: $srcIni" }
        if ($Plan) {
            Say "  would copy $srcIni  ->  $target  (read-only=$($pack.engineIni.setReadOnly))" DarkGray
            return
        }
        $dir = Split-Path $target -Parent
        if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
        if (Test-Path $target) {
            $item = Get-Item $target
            if ($item.IsReadOnly) { $item.IsReadOnly = $false }
            $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
            Copy-Item $target "$target.bak-$stamp" -Force
            Ok "backed up existing -> Engine.ini.bak-$stamp"
        }
        Copy-Item $srcIni $target -Force
        if ($pack.engineIni.setReadOnly) { (Get-Item $target).IsReadOnly = $true }
        Ok "copied $($pack.engineIni.file) -> $target (read-only: $($pack.engineIni.setReadOnly))"
        return
    }

    $baseHits = @(Get-ChildItem -Path $ModsDir -Filter $pack.engineIni.base -File |
                  Sort-Object LastWriteTime -Descending)
    if ($baseHits.Count -eq 0) { throw "no archive matching '$($pack.engineIni.base)' in $ModsDir" }

    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $zip = [System.IO.Compression.ZipFile]::OpenRead($baseHits[0].FullName)
    try {
        $entry = $zip.Entries | Where-Object { $_.FullName -eq $pack.engineIni.baseEntry }
        if (-not $entry) { throw "'$($pack.engineIni.baseEntry)' not inside $($baseHits[0].Name)" }
        $reader = New-Object System.IO.StreamReader($entry.Open())
        $baseText = $reader.ReadToEnd()
        $reader.Close()
    } finally { $zip.Dispose() }

    $appendPath = Resolve-UnderRoot $pack.engineIni.appendFile
    if (-not (Test-Path $appendPath)) { throw "engineIni.appendFile not found: $appendPath" }
    $appendText = Get-Content $appendPath -Raw -Encoding UTF8
    $final = $baseText.TrimEnd() + "`r`n`r`n" + $appendText.TrimEnd() + "`r`n"

    if ($Plan) {
        Say "  would write $target  ($($final.Length) chars, read-only=$($pack.engineIni.setReadOnly))" DarkGray
        return
    }
    $dir = Split-Path $target -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    if (Test-Path $target) {
        $item = Get-Item $target
        if ($item.IsReadOnly) { $item.IsReadOnly = $false }
        $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
        Copy-Item $target "$target.bak-$stamp" -Force
        Ok "backed up existing -> Engine.ini.bak-$stamp"
    }
    Set-Content -Path $target -Value $final -Encoding ASCII -NoNewline
    if ($pack.engineIni.setReadOnly) { (Get-Item $target).IsReadOnly = $true }
    Ok "wrote $target (read-only: $($pack.engineIni.setReadOnly))"
}

function Test-EngineIni {
    Head 'Engine.ini (shared by every Palworld install on this PC)'
    $ini = [Environment]::ExpandEnvironmentVariables(($pack.engineIni.target -replace '/', '\'))
    if (Test-Path $ini) {
        if (Select-String -Path $ini -Pattern '^\[SystemSettings\]' -Quiet) {
            Ok "present with [SystemSettings]  ($ini)"
            return $true
        }
        Warn "present but has no [SystemSettings] block  ($ini)"
        return $false
    }
    Warn "not found: $ini"
    return $false
}

# --------------------------------------------------------------- action loop
function Invoke-Action {
    <# Runs one action over a list of targets and prints a summary.
       Returns $true when something went wrong. #>
    param(
        [ValidateSet('deploy', 'verify', 'remove', 'engineini')]
        [string]$Action,
        $TargetList,
        [switch]$Plan,
        [switch]$AlsoEngineIni,
        [switch]$SkipVerify
    )

    # %LOCALAPPDATA% files are shared by every target - touch each one once per action
    $script:WroteUserConfig = @()
    $script:CheckedUserConfig = @()

    if ($Action -eq 'engineini') {
        try { Write-EngineIni -Plan:$Plan; return $false }
        catch { Bad $_.Exception.Message; return $true }
    }

    $split = Split-Usable $TargetList
    $live = @($split.Live); $broken = @($split.Broken)
    if ($broken) {
        Say ''
        Say 'Unusable targets:' Yellow
        foreach ($b in $broken) { Bad $b }
    }
    if (-not $live) { Bad 'No usable Palworld install among the selected targets.'; return $true }

    $mods = @(Select-Mods)
    if (-not $mods -and $Action -ne 'verify') { Bad 'No mods selected.'; return $true }

    $problems = ($broken.Count -gt 0)
    $summary = @()

    try {
        foreach ($t in $live) {
            switch ($Action) {
                'verify' {
                    Head "verify  $($t.Name)  ->  $($t.Path)"
                    $r = Invoke-VerifyTarget -Target $t
                    if ($r.Missing) { $problems = $true }
                    $summary += [pscustomobject]@{
                        Name = $t.Name
                        Result = "$($r.Present) present, $($r.Missing) missing"
                        Bad = ($r.Missing -gt 0)
                    }
                }
                'remove' {
                    Head "remove  $($t.Name)  ->  $($t.Path)"
                    $n = Invoke-RemoveTarget -Target $t -Mods $mods -Plan:$Plan
                    $verb = if ($Plan) { 'would be deleted' } else { 'deleted' }
                    $summary += [pscustomobject]@{ Name = $t.Name; Result = "$n path(s) $verb"; Bad = $false }
                }
                'deploy' {
                    Head "deploy  $($t.Name)  ->  $($t.Path)"
                    $r = Invoke-DeployTarget -Target $t -Mods $mods -Plan:$Plan
                    if ($r.Failed.Count) { $problems = $true }

                    $res = "$($r.Installed)/$($mods.Count) mods"
                    if (-not $Plan) { $res += ", $($r.Files) files" }
                    if ($r.Failed.Count) { $res += "  FAILED: $($r.Failed -join ', ')" }
                    $verdictBad = ($r.Failed.Count -gt 0)

                    if (-not $Plan -and -not $SkipVerify) {
                        Head "verify  $($t.Name)"
                        $v = Invoke-VerifyTarget -Target $t
                        $res += "  |  verify $($v.Present) present, $($v.Missing) missing"
                        if ($v.Missing) { $problems = $true; $verdictBad = $true }
                    }
                    $summary += [pscustomobject]@{ Name = $t.Name; Result = $res; Bad = $verdictBad }
                }
            }
        }

        if ($Action -eq 'verify') {
            if (-not (Test-EngineIni)) { $problems = $true }
        }
        elseif ($Action -eq 'deploy') {
            if ($AlsoEngineIni) {
                try { Write-EngineIni -Plan:$Plan }
                catch { Bad $_.Exception.Message; $problems = $true }
            }
            else {
                Say "`nEngine.ini not touched (it lives in %LOCALAPPDATA% and is shared by every build above)." DarkGray
            }
        }
        elseif ($Action -eq 'remove') {
            Say "`nEngine.ini in %LOCALAPPDATA% and steam_emu.ini in the game folders were left untouched." DarkGray
        }
    }
    finally { Clear-Sources }

    Head 'Summary'
    foreach ($s in $summary) {
        $tag = if ($s.Bad) { '[FAIL]' } else { '[ok]  ' }
        Write-Host ("  $tag {0,-14} {1}" -f $s.Name, $s.Result) -ForegroundColor $(if ($s.Bad) { 'Red' } else { 'Green' })
    }
    foreach ($b in $broken) { Bad $b }

    Say ''
    if ($problems) { Bad 'finished with problems (see above)' }
    elseif ($Plan) { Say 'Dry run clean. Nothing was written.' Green }
    elseif ($Action -eq 'deploy') { Say 'Deploy complete. Launch the game, then check Pal\Binaries\Win64\ue4ss\UE4SS.log.' Green }
    elseif ($Action -eq 'verify') { Say 'Verify clean.' Green }
    else { Say 'Remove complete.' Green }

    return $problems
}

# =============================================================== batch mode
$anyAction = $Deploy -or $Verify -or $Remove -or $ListMods -or $ListTargets -or
             $DryRun -or $GameDir -or $Targets -or $Only -or $WithEngineIni -or $IncludeDisabled
$script:OnlyMods = $Only

if ($ListMods -and -not $Interactive) { Show-Mods; return }

if ($ListTargets -and -not $Interactive) {
    if ($GameDir) { Say "targets : from -GameDir`n" Cyan } else { Say "targets : $TargetsFile`n" Cyan }
    $all = @(if ($GameDir) { Get-BatchTargets } else { Read-TargetsFile })
    if (-not $all) { Warn 'no targets configured'; return }
    foreach ($t in $all) {
        $state = Get-TargetState $t
        $c = switch ($state) { 'ok' { 'Green' } 'disabled' { 'DarkGray' } default { 'Red' } }
        Write-Host ('{0,-8}  {1,-14} {2}' -f $state, $t.Name, $t.Path) -ForegroundColor $c
        if ($t.Note) { Write-Host "                  note: $($t.Note)" -ForegroundColor DarkYellow }
    }
    Say "`n'NOT PAL' = folder exists but has no $GameExe" DarkGray
    return
}

if ($anyAction -and -not $Interactive) {
    Say "$($pack.packName)" Cyan
    Say "project : $RootDir"
    Say "mods    : $ModsDir"
    $srcLabel = if ($GameDir) { '-GameDir' } else { [System.IO.Path]::GetFileName($TargetsFile) }
    $tl = @(Get-BatchTargets)
    Say "targets : $($tl.Count) (from $srcLabel)"
    foreach ($t in $tl) { Say "          $($t.Name.PadRight(14)) $($t.Path)" }
    if ($DryRun) { Say "mode    : DRY RUN (nothing will be written)" Yellow }

    $action = if ($Verify) { 'verify' } elseif ($Remove) { 'remove' } else { 'deploy' }
    $bad = Invoke-Action -Action $action -TargetList $tl -Plan:$DryRun `
                         -AlsoEngineIni:$WithEngineIni -SkipVerify:$NoVerify
    if ($bad) { exit 1 }
    return
}

# ============================================================ interactive mode
$script:All = @()
$script:Selected = @{}

function Sync-Targets {
    param([switch]$KeepSelection)
    $prev = $script:Selected
    $script:All = @(Read-TargetsFile)
    $script:Selected = @{}
    foreach ($t in $script:All) {
        $usable = ((Get-TargetState $t) -eq 'ok')
        if ($KeepSelection -and $prev.ContainsKey($t.Name)) { $script:Selected[$t.Name] = ($prev[$t.Name] -and $usable) }
        else { $script:Selected[$t.Name] = $usable }
    }
}

function Get-SelectedTargets {
    return @($script:All | Where-Object { $script:Selected[$_.Name] })
}

function Show-Menu {
    $modLabel = if ($script:OnlyMods) { "$($script:OnlyMods.Count) picked: $($script:OnlyMods -join ', ')" }
                else { "$((Select-Mods -Quiet).Count) enabled in modpack.json" }

    Say ''
    Say ('=' * 78) DarkGray
    Say " $($pack.packName)   --   built for $($pack.builtFor)" Cyan
    Say " project : $RootDir" DarkGray
    Say " library : $ModsDir" DarkGray
    Say " targets : $([System.IO.Path]::GetFileName($TargetsFile))" DarkGray
    Say " mods    : $modLabel" DarkGray
    Say ('=' * 78) DarkGray

    if (-not $script:All) {
        Warn 'No targets configured yet. Press + to add the folder with the game.'
    }
    for ($i = 0; $i -lt $script:All.Count; $i++) {
        $t = $script:All[$i]
        $state = Get-TargetState $t
        $mark = if ($script:Selected[$t.Name]) { 'x' } else { ' ' }
        $c = switch ($state) { 'ok' { 'Green' } 'disabled' { 'DarkGray' } default { 'Red' } }
        Write-Host ("  [{0}] {1,2}. {2,-8} {3,-14} {4}" -f $mark, ($i + 1), $state, $t.Name, $t.Path) -ForegroundColor $c
        if ($t.Note) { Write-Host ("           note: {0}" -f $t.Note) -ForegroundColor DarkYellow }
    }

    Say ''
    Say '  1..9  toggle target      a  all / none        +  add a game folder' DarkGray
    Say '  d  deploy to selected    n  dry run           v  verify' DarkGray
    Say '  r  remove mods           e  rewrite Engine.ini from library' DarkGray
    Say '  m  list mods             p  pick mod subset   t  toggle enabled/parked' DarkGray
    Say '  o  edit targets.json     l  reload            q  quit' DarkGray
    Say ''
}

function Ask {
    <# Read-Host that also works when stdin is piped, and returns $null at end of input
       instead of looping forever on an empty read. #>
    param([string]$Prompt)
    try {
        if ([Console]::IsInputRedirected) {
            $line = [Console]::In.ReadLine()
            if ($null -eq $line) { return $null }
            Write-Host "$Prompt $line" -ForegroundColor DarkGray
            return $line
        }
    }
    catch { }   # no real console (ISE and friends) - fall through
    return (Read-Host $Prompt)
}

function Confirm-Action {
    param([string]$Question, [switch]$DefaultYes)
    $hint = if ($DefaultYes) { '[Y/n]' } else { '[y/N]' }
    $a = Ask "$Question $hint"
    if ($null -eq $a) { return $false }
    $a = $a.Trim().ToLower()
    if (-not $a) { return [bool]$DefaultYes }
    return ($a -eq 'y' -or $a -eq 'yes' -or $a -eq 'д' -or $a -eq 'да')
}

function Add-Target {
    Say ''
    # anything sitting next to the project folder that looks like a Palworld install
    $known = @($script:All | ForEach-Object { $_.Path.ToLower() })
    $cands = @()
    $parent = Split-Path $RootDir -Parent
    if ($parent -and (Test-Path $parent)) {
        $cands = @(Get-ChildItem $parent -Directory -ErrorAction SilentlyContinue |
                   Where-Object { (Test-GameRoot $_.FullName) -and ($known -notcontains $_.FullName.ToLower()) })
    }
    if ($cands) {
        Say "Found next to the library:" Cyan
        for ($i = 0; $i -lt $cands.Count; $i++) {
            Write-Host ("  {0}. {1}" -f ($i + 1), $cands[$i].FullName)
        }
        Say '  (or paste any other path, blank cancels)' DarkGray
    }
    else {
        Say 'Paste the path to the game folder - the one holding Pal\ and Engine\ (blank cancels).' Cyan
    }

    $ans = Ask 'path or number'
    if ($null -eq $ans) { return }
    $ans = $ans.Trim()
    if (-not $ans) { return }

    $path = $null
    if ($cands -and $ans -match '^\d+$' -and [int]$ans -ge 1 -and [int]$ans -le $cands.Count) {
        $path = $cands[[int]$ans - 1].FullName
    }
    else { $path = Expand-TargetPath $ans }

    if (-not (Test-Path $path)) { Bad "folder not found: $path"; return }
    if (-not (Test-GameRoot $path)) {
        Bad "not a Palworld install (no $GameExe): $path"
        Say '       Point at the folder that holds Pal\ and Engine\, not at Pal\ itself.' DarkYellow
        return
    }
    $path = (Resolve-Path $path).Path
    if ($known -contains $path.ToLower()) { Warn 'already in targets.json'; return }

    $defName = Split-Path $path -Leaf
    if ($defName -match 'Palworld[-_ ]?(.+)$') { $defName = $Matches[1] }
    $name = Ask "short name [$defName]"
    if ($null -eq $name) { return }
    $name = $name.Trim()
    if (-not $name) { $name = $defName }
    if ($script:All.Name -contains $name) { Bad "a target named '$name' already exists"; return }
    $note = Ask 'note (optional)'
    if ($null -eq $note) { $note = '' }
    $note = $note.Trim()

    $entries = @($script:All) + @([pscustomobject]@{
        Name = $name; Path = $path; Raw = $path; Note = $(if ($note) { $note } else { $null }); Disabled = $false
    })
    Save-TargetsFile -Entries $entries
    Sync-Targets -KeepSelection
    $script:Selected[$name] = $true
    Ok "added '$name' -> $path"
}

function Switch-TargetEnabled {
    $ans = Ask 'toggle enabled/parked for target number'
    if ($null -eq $ans) { return }
    $ans = $ans.Trim()
    if ($ans -notmatch '^\d+$') { return }
    $i = [int]$ans - 1
    if ($i -lt 0 -or $i -ge $script:All.Count) { Warn 'no such target'; return }
    $script:All[$i].Disabled = -not $script:All[$i].Disabled
    Save-TargetsFile -Entries $script:All
    $state = if ($script:All[$i].Disabled) { 'parked (enabled: false)' } else { 'enabled' }
    Sync-Targets -KeepSelection
    Ok "$($script:All[$i].Name): $state"
}

function Select-ModSubset {
    Say ''
    Show-Mods
    Say ''
    Say 'Numbers or names, comma separated. Blank = all enabled mods.' DarkGray
    $ans = Ask 'mods'
    if ($null -eq $ans) { return }
    $ans = $ans.Trim()
    if (-not $ans) { $script:OnlyMods = $null; Ok 'mod subset cleared - the whole enabled pack will be used'; return }

    $picked = @()
    foreach ($tok in ($ans -split '[,\s]+' | Where-Object { $_ })) {
        if ($tok -match '^\d+$') {
            $i = [int]$tok - 1
            if ($i -ge 0 -and $i -lt $pack.mods.Count) { $picked += $pack.mods[$i].name }
            else { Warn "no mod number $tok" }
        }
        else {
            $hit = $pack.mods | Where-Object { $_.name -eq $tok }
            if ($hit) { $picked += $hit.name } else { Warn "no mod named '$tok'" }
        }
    }
    if (-not $picked) { Warn 'nothing matched, subset unchanged'; return }
    $script:OnlyMods = @($picked | Select-Object -Unique)
    Ok "subset: $($script:OnlyMods -join ', ')  (a picked mod is installed even if disabled in the manifest)"
}

function Invoke-OnSelected {
    param([string]$Action, [switch]$Plan, [switch]$AlsoEngineIni)
    $sel = @(Get-SelectedTargets)
    if (-not $sel) { Warn 'no targets selected - press the number to tick one'; return }

    $names = ($sel.Name -join ', ')
    $modCount = (Select-Mods -Quiet).Count
    switch ($Action) {
        'deploy' {
            $q = if ($Plan) { "Dry run: $modCount mods -> $($sel.Count) target(s) [$names]?" }
                 else { "Deploy $modCount mods into $($sel.Count) target(s) [$names]?" }
            if (-not (Confirm-Action $q -DefaultYes:$Plan)) { Say 'cancelled' DarkGray; return }
        }
        'remove' {
            Say "This deletes the mod folders listed in modpack.json from: $names" Yellow
            if (-not (Confirm-Action 'Remove them?')) { Say 'cancelled' DarkGray; return }
        }
    }
    Invoke-Action -Action $Action -TargetList $sel -Plan:$Plan -AlsoEngineIni:$AlsoEngineIni | Out-Null
}

Sync-Targets
Say ''
Say 'Palworld mod deploy - interactive. Press h for the key list, q to quit.' Cyan

while ($true) {
    Show-Menu
    $raw = Ask '>'
    if ($null -eq $raw) { Say 'input closed - bye' Cyan; return }
    $raw = $raw.Trim()
    if (-not $raw) { continue }
    $cmd = $raw.ToLower()

    # digits: toggle those targets
    if ($cmd -match '^[\d,\s]+$') {
        foreach ($tok in ($cmd -split '[,\s]+' | Where-Object { $_ })) {
            $i = [int]$tok - 1
            if ($i -lt 0 -or $i -ge $script:All.Count) { Warn "no target $tok"; continue }
            $t = $script:All[$i]
            $state = Get-TargetState $t
            if ($state -ne 'ok' -and -not $script:Selected[$t.Name]) {
                Warn "$($t.Name): $state - fix it before selecting"
                continue
            }
            $script:Selected[$t.Name] = -not $script:Selected[$t.Name]
        }
        continue
    }

    switch ($cmd) {
        'a' {
            $usable = @($script:All | Where-Object { (Get-TargetState $_) -eq 'ok' })
            $allOn = ($usable.Count -gt 0) -and -not ($usable | Where-Object { -not $script:Selected[$_.Name] })
            foreach ($t in $usable) { $script:Selected[$t.Name] = -not $allOn }
        }
        '+' { Add-Target }
        'd' { Invoke-OnSelected -Action 'deploy' }
        'n' { Invoke-OnSelected -Action 'deploy' -Plan }
        'v' { Invoke-OnSelected -Action 'verify' }
        'r' { Invoke-OnSelected -Action 'remove' }
        'e' {
            Say 'Rewrites %LOCALAPPDATA%\Pal\Saved\Config\Windows\Engine.ini from the library.' Yellow
            Say 'It is shared by every Palworld install on this PC. The current file is backed up first.' Yellow
            if (Confirm-Action 'Rewrite it?') { Invoke-Action -Action 'engineini' | Out-Null }
            else { Say 'cancelled' DarkGray }
        }
        'm' { Say ''; Show-Mods }
        'p' { Select-ModSubset }
        't' { Switch-TargetEnabled }
        'l' { Sync-Targets -KeepSelection; Ok 'reloaded targets.json' }
        'o' {
            if (-not (Test-Path $TargetsFile)) { Warn 'targets.json does not exist yet - press + to create it'; break }
            Start-Process notepad.exe -ArgumentList "`"$TargetsFile`"" -Wait
            Sync-Targets -KeepSelection
            Ok 'reloaded targets.json'
        }
        'h' {
            Say ''
            Say '  1..9 / "1,3"  tick a target on or off. Only usable installs can be ticked.' DarkGray
            Say '  a             tick all usable targets, or untick them all' DarkGray
            Say '  +             add a game folder; offers the ones sitting next to the library' DarkGray
            Say '  d / n         deploy to every ticked target / same but dry run' DarkGray
            Say '  v             verify ticked targets against the verify list in modpack.json' DarkGray
            Say '  r             delete the pack mods from the ticked targets' DarkGray
            Say '  e             rewrite the shared Engine.ini in %LOCALAPPDATA% (backs up first)' DarkGray
            Say '  m / p         list mods / narrow the next action to a subset of them' DarkGray
            Say '  t             park a target (enabled: false) or bring it back' DarkGray
            Say '  o / l         edit targets.json in notepad / reload it from disk' DarkGray
        }
        { $_ -in 'q', 'quit', 'exit' } { Say 'bye' Cyan; return }
        default { Warn "unknown command '$raw' - press h for help" }
    }
}
