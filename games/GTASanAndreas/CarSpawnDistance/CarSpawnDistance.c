/*
 * CarSpawnDistance.asi — GTA San Andreas 1.0 US. Дальность, на которой игра СОЗДАЁТ случайные машины трафика.
 *
 * Зачем: владелец 2026-10-03 поднял ×3 дальности удаления и видимости машин (MixSets), а появление машин MixSets
 * не настраивает. Найдено дизассемблером в CCarCtrl::GenerateOneRandomCar (0x430050):
 *   0x430405  fld  dword [0xB6F11C]        ; TheCamera — множитель дальности генерации
 *   0x43040D  fmul dword [0x858970]        ; 160.0 — константа таблицы .rdata (её читают и другие места игры)
 *   ...       push 0x42180000              ; 38.0 — ближняя граница, не трогаем
 * Константу 160.0 править нельзя (общая), поэтому, как делает сам MixSets для своих дальностей, перенаправляем
 * ОДНУ инструкцию на своё число: 4 байта адреса в 0x43040F. Ставим только поверх точного оригинала.
 * Значение: CarSpawnDistance.ini рядом ([Main] Distance=480.0), без файла — 480.0 (×3 от 160).
 * [NOT-TESTED] СНЯТО 2026-10-03: после установки улицы опустели — подменённое число не «дальность появления» (см. README). Не ставить.
 */
#include <windows.h>
#include <stdlib.h>

#define OPERAND_ADDR 0x0043040F                 /* адрес 4-байтного операнда fmul */
static const BYTE ORIGINAL_CONTEXT[6] = { 0xD8, 0x0D, 0x70, 0x89, 0x85, 0x00 };  /* fmul dword [0x858970] */
static float g_distance = 480.0f;

static char g_log[512];
static int g_len;
static void Log(const char *s) { while (*s && g_len < (int)sizeof(g_log) - 1) g_log[g_len++] = *s++; g_log[g_len] = 0; }

static void SideFile(HMODULE self, const char *ext, char *out)
{
    DWORD n = GetModuleFileNameA(self, out, MAX_PATH);
    while (n > 0 && out[n - 1] != '.') n--;
    lstrcpyA(out + n, ext);
}

static void ReadIni(HMODULE self)
{
    char path[MAX_PATH + 8], buf[64];
    SideFile(self, "ini", path);
    if (GetPrivateProfileStringA("Main", "Distance", "", buf, sizeof(buf), path) > 0) {
        float v = (float)atof(buf);
        if (v >= 40.0f && v <= 5000.0f) g_distance = v;
    }
}

static void WriteLog(HMODULE self)
{
    char path[MAX_PATH + 8];
    HANDLE f;
    DWORD w;
    SideFile(self, "log", path);
    f = CreateFileA(path, GENERIC_WRITE, FILE_SHARE_READ, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
    if (f == INVALID_HANDLE_VALUE) return;
    WriteFile(f, g_log, (DWORD)g_len, &w, NULL);
    CloseHandle(f);
}

BOOL WINAPI DllMain(HINSTANCE inst, DWORD reason, LPVOID reserved)
{
    (void)reserved;
    if (reason == DLL_PROCESS_ATTACH) {
        BYTE *code = (BYTE *)(OPERAND_ADDR - 2);
        DWORD old;
        DisableThreadLibraryCalls(inst);
        ReadIni(inst);
        Log("CarSpawnDistance 1.0\r\n");
        if (IsBadReadPtr(code, 6) || memcmp(code, ORIGINAL_CONTEXT, 6) != 0) {
            Log("skipped: bytes at 0x43040D differ (other exe version or another hook)\r\n");
        } else if (VirtualProtect(code, 6, PAGE_EXECUTE_READWRITE, &old)) {
            float *p = &g_distance;
            memcpy(code + 2, &p, 4);
            VirtualProtect(code, 6, old, &old);
            FlushInstructionCache(GetCurrentProcess(), code, 6);
            Log("patched: car generation distance = ");
            {
                char num[32];
                int whole = (int)g_distance;
                wsprintfA(num, "%d (game 160)\r\n", whole);
                Log(num);
            }
        } else {
            Log("skipped: VirtualProtect failed\r\n");
        }
        WriteLog(inst);
    }
    return TRUE;
}
