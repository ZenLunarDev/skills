#ifndef SEMANTIC_H
#define SEMANTIC_H

#include "parser.h"

typedef struct {
    const char **errors;
    size_t error_count;
    size_t error_capacity;
} SemanticErrorList;

typedef struct {
    const char **names;
    void **values;
    size_t count;
    size_t capacity;
} SymbolTable;

int semantic_analyze(ASTNode *ast, SemanticErrorList *errors);
void semantic_error_list_destroy(SemanticErrorList *list);
SymbolTable *symbol_table_create(void);
void symbol_table_destroy(SymbolTable *table);
int symbol_table_define(SymbolTable *table, const char *name, void *value);
void *symbol_table_get(SymbolTable *table, const char *name);

#endif
