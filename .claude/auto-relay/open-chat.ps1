# open-chat.ps1 - open a NEW Claude Code chat in this project's VS Code window and send the prompt (Windows 11). ASCII only:
# Windows PowerShell 5.1 reads a BOM-less script as ANSI.
# Called by `relay.mjs open` (spawned by .claude/hooks/relay-hook.mjs on the farewell Stop) once the old chat is quiet. Manual test (ELEVATED shell
# when VS Code runs as Administrator - see 3 below):
#   powershell -NoProfile -ExecutionPolicy Bypass -File .claude\auto-relay\open-chat.ps1 -Folder "D:\work\ai_sandbox\KUMM" -Prompt "Answer in one word: opened"
# Route (KAIF ideas/auto_relay_windows_guide.md 4.3, e34fd93): `code <folder>` raises the project window -> the extension deep link
# vscode://anthropic.claude-code/open?prompt=... opens a new chat tab with the text pre-filled (the extension does NOT send it; handler checked in
# extension 2.1.326 on 2026-11-17) -> Enter is pressed ONLY if the foreground window is this project's VS Code. KUMM field changes:
#   1. `code <folder>` WITHOUT -r: -r replaces the folder of the last active window when the project is not open there (KAIF session, 2026-11-17).
#   2. The owner's input first: nothing is raised and no key is pressed until keyboard and mouse were idle -IdleSec (HOUSE_RULES: the owner at the
#      keyboard - no real input); after -IdleWaitSec of his work the opener gives up with FAILED instead of stealing his window.
#   3. VS Code here runs as Administrator ("KUMM - Visual Studio Code [Administrator]"): SendKeys from a non-elevated process does not reach an
#      elevated window (UIPI). The Stop hook runs inside the extension host (elevated), so this script is elevated too.
#   4. ELECTRON_RUN_AS_NODE=1 comes down from the extension host to this script; the link's handler (`Code.exe --open-url -- %1`) inherits it and
#      runs as plain Node - the link reaches no window at all. Removed before the link (2026-11-17 15:21: with it - nothing; without - VS Code's
#      "Allow 'Claude Code for VS Code' extension to open this URI?" in the KUMM window). The cause of the 11:41 "no tab".
#   5. The link carries `windowId=<n>` of this project's window: VS Code routes a URI with that query parameter to that window
#      (URLHandlerRouter#routeCall in VS Code 1.123 main.js); without it the URI goes to the LAST ACTIVE window, any of the four. The number is read
#      from `code --status` ("window [2] (KUMM - Visual Studio Code [Administrator])").
#   6. VS Code asks once per extension "Allow ... to open this URI?" with "Do not ask me again for this extension" - the owner's tick (a security
#      consent, not the agent's); until it is ticked the dialog stands in front of the new chat and Enter is not pressed.
#   7. Enter is OPT-IN (-Enter): the title check cannot prove the new tab exists (EXP-0547), and a default Enter would send the owner's draft or answer
#      his consent box from any careless manual run (relay judge round 2). The idle threshold is the project's own (10 s, `_tools/owner-idle.ps1`), and
#      after the second idle gate NO input at all may arrive before the link and before Enter - one keystroke of the owner's aborts the open.
# [NOT-TESTED] the first Windows run - testcases/TC_auto_relay_2026-11-17.md
param(
  [Parameter(Mandatory = $true)][string]$Folder,
  [string]$Prompt = "resume auto-relay continue",
  [int]$IdleSec = 10,
  [int]$IdleWaitSec = 600,
  [switch]$CtrlEnter,          # set if the extension option "use Ctrl+Enter to send" is on
  [switch]$Enter,              # press Enter in the new chat (opt-in: see 7)
  [switch]$WindowIdOnly        # test: find this project's window number, log it, raise nothing, send nothing; exit 4 if none
)
$log = Join-Path $Folder ".claude\auto-relay\relay.log"
function Log($m) { Add-Content -Path $log -Value ("{0} open-chat: {1}" -f (Get-Date -Format o), $m) }

Add-Type @"
using System; using System.Text; using System.Runtime.InteropServices;
public static class RelayFg {
  [StructLayout(LayoutKind.Sequential)] struct LASTINPUTINFO { public uint cbSize; public uint dwTime; }
  [DllImport("user32.dll")] static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll", CharSet = CharSet.Unicode)] static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll")] static extern bool GetLastInputInfo(ref LASTINPUTINFO p);
  public static string Title() { var sb = new StringBuilder(512); GetWindowText(GetForegroundWindow(), sb, 512); return sb.ToString(); }
  public static double IdleSeconds() {
    var i = new LASTINPUTINFO(); i.cbSize = (uint)Marshal.SizeOf(typeof(LASTINPUTINFO));
    if (!GetLastInputInfo(ref i)) return 0;
    return unchecked((uint)Environment.TickCount - i.dwTime) / 1000.0;
  }
}
"@

$name = Split-Path $Folder -Leaf
# The project's window title: "<name> - Visual Studio Code..." or "<editor> - <name> - Visual Studio Code..." - never just "contains <name>" (a KAIF window
# with KUMM_field_report.md open would pass; the relay judge 2026-11-17).
function IsProjectWindow($t) { return ($t -like "$name - Visual Studio Code*") -or ($t -like "* - $name - Visual Studio Code*") }
$statusTimeoutMs = 20000   # `code --status` walks every open window's files (~34k here): seconds, but never without a bound
function WaitIdle($sec, $maxSec) {
  $deadline = (Get-Date).AddSeconds($maxSec)
  while ([RelayFg]::IdleSeconds() -lt $sec) {
    if ((Get-Date) -gt $deadline) { return $false }
    Start-Sleep -Milliseconds 500
  }
  return $true
}

if (-not (WaitIdle $IdleSec $IdleWaitSec)) {
  Log "FAILED: the keyboard / mouse were busy for $IdleWaitSec s - nothing raised, Enter NOT sent; open a chat and send '$Prompt' by hand"
  exit 2
}
Log "idle $([math]::Round([RelayFg]::IdleSeconds(), 1)) s, foreground '$([RelayFg]::Title())' - looking up the project window"
Remove-Item Env:ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue   # note 4: else the link's handler runs as Node and the link is lost
# Note 5: this project's window number, so the link opens the chat HERE and not in the last active window. `code --status` runs bounded (a busy VS Code
# would otherwise hang the relay silently) into a file of the project's work folder; the title may carry the active editor before the name.
$windowId = $null
$statusOut = Join-Path $Folder ".work\tmp\relay-code-status.txt"
New-Item -ItemType Directory -Force -Path (Split-Path $statusOut) | Out-Null
$codeCmd = (Get-Command code -ErrorAction SilentlyContinue).Source
if ($codeCmd) {
  $st = Start-Process -FilePath $codeCmd -ArgumentList "--status" -RedirectStandardOutput $statusOut -WindowStyle Hidden -PassThru
  # On a timeout the whole tree goes (code.cmd -> the CLI -> its --status child), else the orphans keep scanning and hold the output file (relay judge 2).
  if (-not $st.WaitForExit($statusTimeoutMs)) { & taskkill /PID $st.Id /T /F 2>$null | Out-Null; Log "'code --status' did not answer in $($statusTimeoutMs / 1000) s" }
  $ids = @()
  # Anchored to the process-table columns: command lines of other windows' processes are printed too and may quote "window [5] (KUMM - ...)" (judge 2).
  $row = "^\s*\d+\s+\d+\s+\d+\s+window \[(\d+)\] \("
  foreach ($line in (Get-Content $statusOut -ErrorAction SilentlyContinue)) {
    if ($line -match $row) { $ids += $Matches[1] }
    if (-not $windowId -and $line -match ($row + "(?:.* - )?$([regex]::Escape($name)) - Visual Studio Code")) { $windowId = $Matches[1] }
  }
  Remove-Item $statusOut -ErrorAction SilentlyContinue
  # VS Code matches the number as a PREFIX (new RegExp("window:" + id), unanchored): windowId=2 would also take window 20-29. Then the number is left out.
  if ($windowId -and @($ids | Where-Object { $_ -ne $windowId -and $_.StartsWith($windowId) }).Count -gt 0) {
    Log "window [$windowId] is $name, but another window number starts with it - the link goes without windowId"; $windowId = $null
  }
}
if ($windowId) { Log "window [$windowId] is $name" } else { Log "no window number of $name - the link goes to the last active window (raised just before)" }
if ($WindowIdOnly) { Log "-WindowIdOnly: nothing raised, nothing sent"; if ($windowId) { exit 0 } else { exit 4 } }
# The status walk takes seconds: the owner may have come back meanwhile - the idle gate again right before the raise (note 2; the relay judge).
if (-not (WaitIdle $IdleSec $IdleWaitSec)) {
  Log "FAILED: the keyboard / mouse were busy for $IdleWaitSec s - nothing raised, Enter NOT sent; open a chat and send '$Prompt' by hand"
  exit 2
}
# From here no input at all may arrive (note 7): one keystroke of the owner's since this tick aborts the link and the Enter.
$gateTick = [Environment]::TickCount
function QuietSinceGate { return ([RelayFg]::IdleSeconds() * 1000) -ge ([Environment]::TickCount - $gateTick) }
& code "$Folder"
Start-Sleep -Seconds 2
if (-not (QuietSinceGate)) { Log "FAILED: the owner touched the keyboard / mouse after the window rose - the link NOT sent; open a chat and send '$Prompt' by hand"; exit 2 }
# windowId FIRST: VS Code's router takes the first "windowId=" in the decoded query, so a prompt that contains one could not steer the link.
$link = "vscode://anthropic.claude-code/open?"
if ($windowId) { $link += "windowId=$windowId&" }
$link += "prompt=" + [uri]::EscapeDataString($Prompt)
Start-Process $link

# Wait up to 15 s for this project's VS Code window to be in front (title: "... - <folder> - Visual Studio Code [Administrator]").
$ws = New-Object -ComObject WScript.Shell
for ($i = 0; $i -lt 30; $i++) {
  Start-Sleep -Milliseconds 500
  $t = [RelayFg]::Title()
  if (IsProjectWindow $t) {
    Start-Sleep -Milliseconds 1500                         # the new chat input mounts after the tab opens
    $t2 = [RelayFg]::Title()
    if (-not (IsProjectWindow $t2)) { continue }           # the focus moved away during the wait - look again
    if (-not $Enter) { Log "opened with the text, Enter NOT pressed (Enter is opt-in) in '$t2'"; exit 0 }
    if (-not (QuietSinceGate)) { Log "FAILED: the owner typed while the chat opened - Enter NOT sent; send '$Prompt' by hand"; exit 3 }
    if ($CtrlEnter) { $ws.SendKeys("^~") } else { $ws.SendKeys("~") }
    Log "sent '$Prompt' to '$t2'"
    exit 0
  }
  # (The old AppActivate nudge is gone: it raised any "...Visual Studio Code" window with no idle gate - relay judge 2.)
}
Log "FAILED: foreground window is '$([RelayFg]::Title())', not VS Code of $name - Enter NOT sent; open a chat and send '$Prompt' by hand"
exit 1
