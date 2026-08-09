#include "semantic.h"
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

SemanticErrorList *semantic_error_list_create(void) {
    SemanticErrorList *list = malloc(sizeof(SemanticErrorList));
    list->errors = NULL;
    list->error_count = 0;
    list->error_capacity = 0;
    return list;
}

void semantic_error_list_add(SemanticErrorList *list, const char *message) {
    if (list->error_count >= list->error_capacity) {
        list->error_capacity = list->error_capacity == 0 ? 8 : list->error_capacity * 2;
        list->errors = realloc(list->errors, list->error_capacity * sizeof(const char *));
    }
    list->errors[list->error_count++] = message;
}

void semantic_error_list_destroy(SemanticErrorList *list) {
    if (!list) return;
    for (size_t i = 0; i < list->error_count; i++) {
        free((void *)list->errors[i]);
    }
    free(list->errors);
    free(list);
}

SymbolTable *symbol_table_create(void) {
    SymbolTable *table = malloc(sizeof(SymbolTable));
    table->names = NULL;
    table->values = NULL;
    table->count = 0;
    table->capacity = 0;
    return table;
}

void symbol_table_destroy(SymbolTable *table) {
    if (!table) return;
    for (size_t i = 0; i < table->count; i++) {
        free((void *)table->names[i]);
    }
    free(table->names);
    free(table->values);
    free(table);
}

int symbol_table_define(SymbolTable *table, const char *name, void *value) {
    if (table->count >= table->capacity) {
        table->capacity = table->capacity == 0 ? 8 : table->capacity * 2;
        table->names = realloc(table->names, table->capacity * sizeof(const char *));
        table->values = realloc(table->values, table->capacity * sizeof(void *));
    }
    table->names[table->count] = strdup(name);
    table->values[table->count] = value;
    table->count++;
    return 0;
}

void *symbol_table_get(SymbolTable *table, const char *name) {
    for (size_t i = 0; i < table->count; i++) {
        if (strcmp(table->names[i], name) == 0) {
            return table->values[i];
        }
    }
    return NULL;
}

int semantic_analyze(ASTNode *ast, SemanticErrorList *errors) {
    (void)ast;
    (void)errors;
    return 0;
}
