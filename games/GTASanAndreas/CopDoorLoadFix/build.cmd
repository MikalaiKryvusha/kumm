@echo off
rem Build CopDoorLoadFix.asi (32-bit) with Visual Studio 2022 x86 tools.
rem Output goes to %1 (default: this folder\out). Static CRT, no extra DLLs.
setlocal
set "SRC=%~dp0CopDoorLoadFix.c"
set "OUT=%~1"
if "%OUT%"=="" set "OUT=%~dp0out"
if not exist "%OUT%" mkdir "%OUT%"
call "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars32.bat" >nul || exit /b 2
cl /nologo /W4 /O1 /MT /LD "%SRC%" /Fo"%OUT%\\" /Fe"%OUT%\CopDoorLoadFix.asi" /link /NOLOGO kernel32.lib || exit /b 1
echo built "%OUT%\CopDoorLoadFix.asi"
