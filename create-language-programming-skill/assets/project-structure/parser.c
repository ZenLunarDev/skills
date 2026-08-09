#include "parser.h"
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <stdbool.h>

Parser *parser_create(Lexer *lexer) {
    Parser *parser = malloc(sizeof(Parser));
    if (!parser) return NULL;
    parser->lexer = lexer;
    parser->current = lexer_next(lexer);
    parser->had_error = false;
    parser->panic_mode = false;
    return parser;
}

void parser_destroy(Parser *parser) {
    free(parser);
}

void parser_error_at(Parser *parser, const char *message) {
    if (parser->panic_mode) return;
    parser->panic_mode = true;
    fprintf(stderr, "[line %d:%d] Error: %s\\n", parser->current.line, parser->current.column, message);
    parser->had_error = true;
}

void parser_advance(Parser *parser) {
    parser->current = lexer_next(parser->lexer);
    if (parser->current.type == TOKEN_ERROR) {
        parser_error_at(parser, parser->current.lexeme);
    }
}

bool parser_check(Parser *parser, TokenType type) {
    return parser->current.type == type;
}

bool parser_match(Parser *parser, TokenType type) {
    if (parser_check(parser, type)) {
        parser_advance(parser);
        return true;
    }
    return false;
}

ASTNode *parser_consume(Parser *parser, TokenType type, const char *message) {
    if (parser_check(parser, type)) {
        parser_advance(parser);
        return NULL;
    }
    parser_error_at(parser, message);
    return NULL;
}

ASTNode *ast_node_create(ASTNodeType type) {
    ASTNode *node = calloc(1, sizeof(ASTNode));
    node->type = type;
    node->line = 0;
    node->column = 0;
    return node;
}

void ast_node_destroy(ASTNode *node) {
    if (!node) return;
    switch (node->type) {
        case AST_PROGRAM:
            for (size_t i = 0; i < node->as.program.count; i++) {
                ast_node_destroy(node->as.program.statements[i]);
            }
            free(node->as.program.statements);
            break;
        case AST_FUNCTION:
            free((void *)node->as.function.name);
            for (size_t i = 0; i < node->as.function.param_count; i++) {
                ast_node_destroy(node->as.function.params[i]);
            }
            free(node->as.function.params);
            ast_node_destroy(node->as.function.body);
            break;
        case AST_VARIABLE:
            free((void *)node->as.variable.name);
            ast_node_destroy(node->as.variable.initializer);
            break;
        case AST_BINARY:
            ast_node_destroy(node->as.binary.left);
            ast_node_destroy(node->as.binary.right);
            free((void *)node->as.binary.op);
            break;
        case AST_UNARY:
            ast_node_destroy(node->as.unary.operand);
            free((void *)node->as.unary.op);
            break;
        case AST_CALL:
            ast_node_destroy(node->as.call.callee);
            for (size_t i = 0; i < node->as.call.arg_count; i++) {
                ast_node_destroy(node->as.call.args[i]);
            }
            free(node->as.call.args);
            break;
        case AST_RETURN:
            ast_node_destroy(node->as.ret.value);
            break;
        case AST_IF:
            ast_node_destroy(node->as.if_stmt.condition);
            ast_node_destroy(node->as.if_stmt.then_branch);
            ast_node_destroy(node->as.if_stmt.else_branch);
            break;
        case AST_WHILE:
            ast_node_destroy(node->as.while_stmt.condition);
            ast_node_destroy(node->as.while_stmt.body);
            break;
        case AST_FOR:
            ast_node_destroy(node->as.for_stmt.init);
            ast_node_destroy(node->as.for_stmt.condition);
            ast_node_destroy(node->as.for_stmt.increment);
            ast_node_destroy(node->as.for_stmt.body);
            break;
        case AST_BLOCK:
            for (size_t i = 0; i < node->as.block.count; i++) {
                ast_node_destroy(node->as.block.statements[i]);
            }
            free(node->as.block.statements);
            break;
        case AST_EXPRESSION_STMT:
            ast_node_destroy(node->as.expr_stmt.expression);
            break;
        case AST_LITERAL:
        case AST_NOOP:
            break;
    }
    free(node);
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

ASTNode *parser_parse(Parser *parser) {
    ASTNode *program = ast_node_create(AST_PROGRAM);
    program->line = parser->current.line;
    program->column = parser->current.column;

    size_t capacity = 8;
    program->as.program.statements = malloc(capacity * sizeof(ASTNode *));
    program->as.program.count = 0;

    while (!parser_check(parser, TOKEN_EOF)) {
        if (program->as.program.count >= capacity) {
            capacity *= 2;
            program->as.program.statements = realloc(program->as.program.statements, capacity * sizeof(ASTNode *));
        }
        // Parse statement (stub)
        ASTNode *stmt = ast_node_create(AST_NOOP);
        program->as.program.statements[program->as.program.count++] = stmt;
    }

    return program;
}

void ast_print(ASTNode *node, int indent) {
    if (!node) return;
    for (int i = 0; i < indent; i++) printf("  ");
    printf("%s", ast_node_type_to_string(node->type));
    if (node->type == AST_IDENTIFIER) {
        printf("(%s)\\n", node->as.identifier.name);
    } else if (node->type == AST_LITERAL) {
        printf("(%g)\\n", node->as.literal.value);
    } else {
        printf("\\n");
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
        default:
            break;
    }
}
