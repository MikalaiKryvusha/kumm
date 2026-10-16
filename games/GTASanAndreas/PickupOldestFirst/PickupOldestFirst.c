/*
 * PickupOldestFirst.asi — GTA San Andreas 1.0 US.
 *
 * Баг 52 (2026-10-16): в войне банд выпавшие бронежилеты и оружие появляются и тут же исчезают. Пул пикапов игры —
 * 620 слотов (CPickups::aPickUps, 0x9788C0, по 0x20 байт), и он полон: в сейве владельца занято 619, из них 511 —
 * постоянные пикапы карты. Когда свободного слота нет, CPickups::GenerateNewOne (0x456F20) затирает ПЕРВЫЙ по порядку
 * слот с деньгами (тип 8), потом ПЕРВЫЙ слот типа 4/5 (выпавшее оружие, бронежилеты и аптечки войны банд). Поиск
 * всегда с начала массива, поэтому новая вещь затирает предыдущую новую — «появилось и исчезло».
 *
 * Заплатка (выбор владельца — вариант А, 2026-10-16): в ветке «пул полон» (0x457000) вместо двух поисков «первого»
 * выбираем среди типов 4, 5, 8 слот с САМЫМ РАННИМ сроком исчезновения (+0x0C — момент, когда пикап сам исчезнет;
 * при одинаковых 10 минутах это самая старая вещь) и отдаём его индекс в родное продолжение 0x45719A: оно убирает
 * старый объект из мира и занимает слот. Нечего затирать — как в оригинале: пикап не создаётся (0x4571D9).
 * Предел 620 и формат сейва не меняются; снимается удалением .asi.
 *
 * Байты пишутся ТОЛЬКО если на месте ровно оригинал: другая версия exe или чужой хук → ничего не трогаем и говорим
 * об этом в журнале рядом с .asi (тот же приём, что CopDoorLoadFix).
 * [NOT-TESTED] — собрана; в игре не запускалась (кейсы: testcases/TC_gtasa_pickup_oldest_first_2026-10-16.md).
 */
#include <windows.h>

#define PICKUPS_BASE  0x009788C0u   /* CPickups::aPickUps                                  */
#define PICKUP_SIZE   0x20u         /* sizeof(CPickup)                                      */
#define NUM_PICKUPS   620           /* 0x26C — граница циклов в 0x456F20                    */
#define OFF_EXPIRY    0x0C          /* момент исчезновения: CTimer + время жизни (0x45728A) */
#define OFF_TYPE      0x1C          /* ePickupType                                          */
#define TYPE_ONCE_TIMEOUT       4   /* выпавшее с NPC оружие                                */
#define TYPE_ONCE_TIMEOUT_SLOW  5   /* бронежилет / аптечка волны войны банд                */
#define TYPE_MONEY              8   /* выпавшие деньги                                      */

#define SITE_FALLBACK 0x00457000u   /* начало ветки «свободного слота нет»                  */
static DWORD g_reuse = 0x0045719Au; /* занять слот ebx: убрать старый объект, заполнить     */
static DWORD g_fail  = 0x004571D9u; /* pop esi / or eax,-1 / pop ebx / ret — пикапа не будет */

/* Оригинал игры в 0x457000: xor ebx,ebx / mov eax,0x9788FC — 7 байт. */
static const BYTE ORIGINAL[7] = { 0x31, 0xDB, 0xB8, 0xFC, 0x88, 0x97, 0x00 };

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

/* Журнал рядом с .asi: patched / already / skipped. */
static void LogWrite(HMODULE self)
{
    char path[MAX_PATH];
    DWORD len = GetModuleFileNameA(self, path, MAX_PATH);
    HANDLE file;
    DWORD written;
    while (len > 0 && path[len - 1] != '.') len--;
    if (len == 0 || len + 3 >= MAX_PATH) return;
    path[len] = 'l'; path[len + 1] = 'o'; path[len + 2] = 'g'; path[len + 3] = 0;
    file = CreateFileA(path, GENERIC_WRITE, FILE_SHARE_READ, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
    if (file == INVALID_HANDLE_VALUE) return;
    WriteFile(file, g_log, (DWORD)g_logLen, &written, NULL);
    CloseHandle(file);
}

/* Слот, который пора затереть: среди денег и выпавшего — тот, что исчезнет раньше всех. -1 — затирать нечего.
 * Сравнение через знаковую разность: переполнение счётчика CTimer (49 дней) порядок не ломает. */
static int __cdecl PickSlotToReuse(void)
{
    const BYTE *base = (const BYTE *)PICKUPS_BASE;
    int best = -1;
    DWORD bestExpiry = 0;
    int i;
    for (i = 0; i < NUM_PICKUPS; i++) {
        const BYTE *pickup = base + (DWORD)i * PICKUP_SIZE;
        BYTE type = pickup[OFF_TYPE];
        DWORD expiry;
        if (type != TYPE_ONCE_TIMEOUT && type != TYPE_ONCE_TIMEOUT_SLOW && type != TYPE_MONEY) continue;
        expiry = *(const DWORD *)(pickup + OFF_EXPIRY);
        if (best < 0 || (LONG)(expiry - bestExpiry) < 0) { best = i; bestExpiry = expiry; }
    }
    return best;
}

/* Вход по jmp из 0x457000. Стек и регистры — как у оригинала в этой точке: ebx, esi уже сохранены функцией,
 * cl = тип нового пикапа, dl = флаг isEmpty — их ждёт продолжение, поэтому ecx/edx сберегаем вокруг вызова. */
static __declspec(naked) void FallbackStub(void)
{
    __asm {
        push ecx
        push edx
        call PickSlotToReuse
        pop  edx
        pop  ecx
        test eax, eax
        js   nothing_to_reuse
        mov  ebx, eax
        jmp  dword ptr [g_reuse]
    nothing_to_reuse:
        jmp  dword ptr [g_fail]
    }
}

static void PatchFallback(void)
{
    BYTE *code = (BYTE *)SITE_FALLBACK;
    BYTE patch[7];
    DWORD oldProtect;
    LONG rel = (LONG)((DWORD)FallbackStub - (SITE_FALLBACK + 5));
    patch[0] = 0xE9;
    memcpy(patch + 1, &rel, 4);
    patch[5] = 0x90;
    patch[6] = 0x90;
    LogHex(SITE_FALLBACK);
    if (IsBadReadPtr(code, sizeof(ORIGINAL))) { LogAppend(" skipped: unreadable\r\n"); return; }
    if (code[0] == 0xE9 && code[5] == 0x90 && code[6] == 0x90 &&
        *(const LONG *)(code + 1) == rel) { LogAppend(" already patched\r\n"); return; }
    if (memcmp(code, ORIGINAL, sizeof(ORIGINAL)) != 0) {
        LogAppend(" skipped: bytes differ (other exe version or another hook)\r\n");
        return;
    }
    if (!VirtualProtect(code, sizeof(patch), PAGE_EXECUTE_READWRITE, &oldProtect)) {
        LogAppend(" skipped: VirtualProtect failed\r\n");
        return;
    }
    memcpy(code, patch, sizeof(patch));
    VirtualProtect(code, sizeof(patch), oldProtect, &oldProtect);
    FlushInstructionCache(GetCurrentProcess(), code, sizeof(patch));
    LogAppend(" patched\r\n");
}

BOOL WINAPI DllMain(HINSTANCE instance, DWORD reason, LPVOID reserved)
{
    (void)reserved;
    if (reason == DLL_PROCESS_ATTACH) {
        DisableThreadLibraryCalls(instance);
        LogAppend("PickupOldestFirst 1.0 - full pickup pool reuses the pickup that expires first, not the newest\r\n");
        PatchFallback();
        LogWrite(instance);
    }
    return TRUE;
}
