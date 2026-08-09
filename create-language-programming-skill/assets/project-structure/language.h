#ifndef LANGUAGE_H
#define LANGUAGE_H

#include <stddef.h>

typedef enum {
    LANG_OK = 0,
    LANG_ERROR_SYNTAX = 1,
    LANG_ERROR_SEMANTIC = 2,
    LANG_ERROR_IO = 3,
    LANG_ERROR_MEMORY = 4
} LangStatus;

typedef struct {
    const char *name;
    int version_major;
    int version_minor;
    int version_patch;
} LangInfo;

LangInfo lang_get_info(void);
LangStatus lang_init(void);
void lang_cleanup(void);
int lang_compile_file(const char *path);
int lang_run_string(const char *source);

#endif
