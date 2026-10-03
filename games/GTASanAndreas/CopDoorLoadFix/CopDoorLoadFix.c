/*
 * CopDoorLoadFix.asi — GTA San Andreas 1.0 US.
 *
 * Краш 2026-10-03 08:40: игрок в машине, коп открывает дверь, чтобы вытащить и арестовать,
 * игрок грузит сейв из меню → «Access violation reading 0x00000474» в 0x00645F40
 * (CTaskSimpleCarOpenDoorFromOutside::~CTaskSimpleCarOpenDoorFromOutside, CrashInfo v1.2).
 *
 * Почему: если у задачи стоит флаг «полиция открыла дверь игроку» (байт +0x19), задача на выходе
 * зовёт FindPlayerPed(-1) и без проверки пишет флаг игроку: [ped+0x474] |= 0x4000000.
 * При загрузке сейва мир сносится, CJ удалён раньше копа, FindPlayerPed возвращает 0 →
 * запись в 0 + 0x474. Это баг самой игры, не мода. Тот же код стоит второй раз в 0x0064AD63
 * (соседний метод той же задачи, по виду MakeAbortable) — закрываем оба места.
 * MTA чинит соседа (FinishAnimCarOpenDoorFromOutsideCB, CrashFix_Misc25), этот — нет;
 * SilentPatch эти адреса не трогает (сверено по исходнику 2026-10-03).
 *
 * Заплатка на месте, 22 байта, без пещеры кода: семантика та же, плюс «если игрока нет — мимо».
 *   было:  mov ecx,[eax+474h] / add eax,474h / add esp,4 / or ecx,4000000h / mov [eax],ecx
 *   стало: add esp,4 / test eax,eax / jz +0Fh / or dword [eax+474h],4000000h / nop×5
 * Байты пишутся ТОЛЬКО если на месте ровно оригинал: другая версия exe или чужой хук → ничего
 * не трогаем и говорим об этом в журнале рядом с .asi.
 * [NOT-TESTED] — на живой игре 2026-10-03 увидено только, что заплатка встала (журнал + байты в памяти,
 * меню открылось); сам сценарий «загрузка сейва во время ареста из машины» ещё не пройден
 * (testcases/reports/2026-10-03_gtasa-copdoor-fix.md).
 */
#include <windows.h>

/* Оригинал игры с адреса сразу после call FindPlayerPed — одинаков в обоих местах. */
static const BYTE ORIGINAL[22] = {
    0x8B, 0x88, 0x74, 0x04, 0x00, 0x00,       /* mov ecx, [eax+474h]      */
    0x05, 0x74, 0x04, 0x00, 0x00,             /* add eax, 474h            */
    0x83, 0xC4, 0x04,                         /* add esp, 4               */
    0x81, 0xC9, 0x00, 0x00, 0x00, 0x04,       /* or  ecx, 4000000h        */
    0x89, 0x08                                /* mov [eax], ecx           */
};

/* jz +0Fh от конца инструкции попадает ровно на байт после 22-байтного окна. */
static const BYTE PATCHED[22] = {
    0x83, 0xC4, 0x04,                         /* add esp, 4  (cdecl-аргумент FindPlayerPed) */
    0x85, 0xC0,                               /* test eax, eax            */
    0x74, 0x0F,                               /* jz  конец окна           */
    0x81, 0x88, 0x74, 0x04, 0x00, 0x00,       /* or  dword [eax+474h],    */
    0x00, 0x00, 0x00, 0x04,                   /*     4000000h             */
    0x90, 0x90, 0x90, 0x90, 0x90              /* nop × 5                  */
};

static const DWORD SITES[] = {
    0x00645F40,   /* ~CTaskSimpleCarOpenDoorFromOutside — место краша 2026-10-03 */
    0x0064AD63    /* тот же код в соседнем методе задачи                       */
};
#define SITE_COUNT (sizeof(SITES) / sizeof(SITES[0]))

static char g_log[1024];
static int  g_logLen;

static void LogAppend(const char *text)
{
    while (*text && g_logLen < (int)sizeof(g_log) - 1) g_log[g_logLen++] = *text++;
    g_log[g_logLen] = 0;
}

static void LogHex(DWORD value)
{
    char buf[11] = "0x00000000";
    int i;
    for (i = 0; i < 8; i++) buf[9 - i] = "0123456789ABCDEF"[(value >> (i * 4)) & 0xF];
    LogAppend(buf);
}

/* Журнал рядом с .asi: одна строка на место — patched / already / skipped. */
static void LogWrite(HMODULE self)
{
    char path[MAX_PATH];
    DWORD len = GetModuleFileNameA(self, path, MAX_PATH);
    HANDLE file;
    DWORD written;
    while (len > 0 && path[len - 1] != '.') len--;
    if (len == 0 || len + 3 >= MAX_PATH) return;
    path[len] = 'l'; path[len + 1] = 'o'; path[len + 2] = 'g'; path[len + 3] = 0;
    file = CreateFileA(path, GENERIC_WRITE, FILE_SHARE_READ, NULL, CREATE_ALWAYS,
                       FILE_ATTRIBUTE_NORMAL, NULL);
    if (file == INVALID_HANDLE_VALUE) return;
    WriteFile(file, g_log, (DWORD)g_logLen, &written, NULL);
    CloseHandle(file);
}

static void PatchSite(DWORD address)
{
    BYTE *code = (BYTE *)address;
    DWORD oldProtect;
    LogHex(address);
    if (IsBadReadPtr(code, sizeof(ORIGINAL))) { LogAppend(" skipped: unreadable\r\n"); return; }
    if (memcmp(code, PATCHED, sizeof(PATCHED)) == 0) { LogAppend(" already patched\r\n"); return; }
    if (memcmp(code, ORIGINAL, sizeof(ORIGINAL)) != 0) {
        LogAppend(" skipped: bytes differ (other exe version or another hook)\r\n");
        return;
    }
    if (!VirtualProtect(code, sizeof(PATCHED), PAGE_EXECUTE_READWRITE, &oldProtect)) {
        LogAppend(" skipped: VirtualProtect failed\r\n");
        return;
    }
    memcpy(code, PATCHED, sizeof(PATCHED));
    VirtualProtect(code, sizeof(PATCHED), oldProtect, &oldProtect);
    FlushInstructionCache(GetCurrentProcess(), code, sizeof(PATCHED));
    LogAppend(" patched\r\n");
}

BOOL WINAPI DllMain(HINSTANCE instance, DWORD reason, LPVOID reserved)
{
    unsigned i;
    (void)reserved;
    if (reason == DLL_PROCESS_ATTACH) {
        DisableThreadLibraryCalls(instance);
        LogAppend("CopDoorLoadFix 1.0 - null check for FindPlayerPed in CTaskSimpleCarOpenDoorFromOutside\r\n");
        for (i = 0; i < SITE_COUNT; i++) PatchSite(SITES[i]);
        LogWrite(instance);
    }
    return TRUE;
}
