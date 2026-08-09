#include "ast.h"
#include <stdio.h>
#include <string.h>

void ast_print(ASTNode *node, int indent) {
    if (!node) return;
    for (int i = 0; i < indent; i++) printf("  ");
    printf("%s", ast_node_type_to_string(node->type));
    switch (node->type) {
        case AST_LITERAL:
            printf("(%g)\\n", node->as.literal.value);
            break;
        case AST_IDENTIFIER:
            printf("(%s)\\n", node->as.identifier.name);
            break;
        default:
            printf("\\n");
            break;
    }
    switch (node->type) {
        case AST_PROGRAM:
            for (size_t i = 0; i < node->as.program.count; i++) {
                ast_print(node->as.program.statements[i], indent + 1);
            }
            break;
        case AST_FUNCTION:
            for (size_t i = 0; i < node->as.function.param_count; i++) {
                ast_print(node->as.function.params[i], indent + 1);
            }
            ast_print(node->as.function.body, indent + 1);
            break;
        case AST_BINARY:
            ast_print(node->as.binary.left, indent + 1);
            ast_print(node->as.binary.right, indent + 1);
            break;
        case AST_UNARY:
            ast_print(node->as.unary.operand, indent + 1);
            break;
        case AST_CALL:
            ast_print(node->as.call.callee, indent + 1);
            for (size_t i = 0; i < node->as.call.arg_count; i++) {
                ast_print(node->as.call.args[i], indent + 1);
            }
            break;
        case AST_RETURN:
            ast_print(node->as.ret.value, indent + 1);
            break;
        case AST_IF:
            ast_print(node->as.if_stmt.condition, indent + 1);
            ast_print(node->as.if_stmt.then_branch, indent + 1);
            if (node->as.if_stmt.else_branch) {
                ast_print(node->as.if_stmt.else_branch, indent + 1);
            }
            break;
        case AST_WHILE:
            ast_print(node->as.while_stmt.condition, indent + 1);
            ast_print(node->as.while_stmt.body, indent + 1);
            break;
        case AST_FOR:
            ast_print(node->as.for_stmt.init, indent + 1);
            ast_print(node->as.for_stmt.condition, indent + 1);
            ast_print(node->as.for_stmt.increment, indent + 1);
            ast_print(node->as.for_stmt.body, indent + 1);
            break;
        case AST_BLOCK:
            for (size_t i = 0; i < node->as.block.count; i++) {
                ast_print(node->as.block.statements[i], indent + 1);
            }
            break;
        case AST_EXPRESSION_STMT:
            ast_print(node->as.expr_stmt.expression, indent + 1);
            break;
        default:
            break;
    }
}

const char *ast_node_type_to_string(ASTNodeType type) {
    switch (type) {
        case AST_PROGRAM: return "Program";
        case AST_FUNCTION: return "Function";
        case AST_VARIABLE: return "Variable";
        case AST_BINARY: return "Binary";
        case AST_UNARY: return "Unary";
        case AST_LITERAL: return "Literal";
        case AST_CALL: return "Call";
        case AST_RETURN: return "Return";
        case AST_IF: return "If";
        case AST_WHILE: return "While";
        case AST_FOR: return "For";
        case AST_BLOCK: return "Block";
        case AST_EXPRESSION_STMT: return "ExprStmt";
        case AST_NOOP: return "Noop";
        default: return "Unknown";
    }
}

void ast_destroy(ASTNode *node) {
    ast_node_destroy(node);
}
