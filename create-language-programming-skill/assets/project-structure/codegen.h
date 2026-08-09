#ifndef CODEGEN_H
#define CODEGEN_H

#include "parser.h"

typedef struct {
    FILE *fp;
    int indent_level;
    bool had_error;
} CodeGenerator;

CodeGenerator *codegen_create(const char *output_path);
void codegen_destroy(CodeGenerator *gen);
int codegen_generate(ASTNode *ast, CodeGenerator *gen);
void codegen_error(CodeGenerator *gen, const char *message);
void codegen_indent(CodeGenerator *gen);
void codegen_write_line(CodeGenerator *gen, const char *fmt, ...);

#endif
