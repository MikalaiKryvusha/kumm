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
# [NOT-TESTED] the first Windows run - testcases/TC_auto_relay_2026-11-17.md
param(
  [Parameter(Mandatory = $true)][string]$Folder,
  [string]$Prompt = "resume auto-relay continue",
  [int]$IdleSec = 3,
  [int]$IdleWaitSec = 600,
  [switch]$CtrlEnter,          # set if the extension option "use Ctrl+Enter to send" is on
  [switch]$NoEnter             # test: open the chat with the text, press nothing
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
function IsProjectWindow($t) { return ($t -like "*$name*") -and ($t -like "*Visual Studio Code*") }
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
Log "idle $([math]::Round([RelayFg]::IdleSeconds(), 1)) s, foreground '$([RelayFg]::Title())' - raising the project window"
& code "$Folder"
Start-Sleep -Seconds 2
Start-Process ("vscode://anthropic.claude-code/open?prompt=" + [uri]::EscapeDataString($Prompt))

# Wait up to 15 s for this project's VS Code window to be in front (title: "... - <folder> - Visual Studio Code [Administrator]").
$ws = New-Object -ComObject WScript.Shell
for ($i = 0; $i -lt 30; $i++) {
  Start-Sleep -Milliseconds 500
  $t = [RelayFg]::Title()
  if (IsProjectWindow $t) {
    Start-Sleep -Milliseconds 1500                         # the new chat input mounts after the tab opens
    $t2 = [RelayFg]::Title()
    if (-not (IsProjectWindow $t2)) { continue }           # the focus moved away during the wait - look again
    if ($NoEnter) { Log "opened with the text, Enter NOT pressed (-NoEnter) in '$t2'"; exit 0 }
    if (-not (WaitIdle 1 30)) { Log "FAILED: the owner typed while the chat opened - Enter NOT sent; send '$Prompt' by hand"; exit 3 }
    if ($CtrlEnter) { $ws.SendKeys("^~") } else { $ws.SendKeys("~") }
    Log "sent '$Prompt' to '$t2'"
    exit 0
  }
  if ($i -eq 10) { $null = $ws.AppActivate("Visual Studio Code") }   # one nudge if the window did not come forward by itself
}
Log "FAILED: foreground window is '$([RelayFg]::Title())', not VS Code of $name - Enter NOT sent; open a chat and send '$Prompt' by hand"
exit 1
