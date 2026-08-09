#ifndef AST_H
#define AST_H

#include "parser.h"

void ast_print(ASTNode *node, int indent);
const char *ast_node_type_to_string(ASTNodeType type);
void ast_destroy(ASTNode *node);

#endif
