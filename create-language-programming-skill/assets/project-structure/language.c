#include "language.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

LangInfo lang_get_info(void) {
    LangInfo info = {
        .name = "Language",
        .version_major = 0,
        .version_minor = 1,
        .version_patch = 0
    };
    return info;
}

LangStatus lang_init(void) {
    return LANG_OK;
}

void lang_cleanup(void) {
}

int lang_compile_file(const char *path) {
    (void)path;
    return LANG_OK;
}

int lang_run_string(const char *source) {
    (void)source;
    return LANG_OK;
}
