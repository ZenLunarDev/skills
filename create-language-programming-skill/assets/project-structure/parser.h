#ifndef PARSER_H
#define PARSER_H

#include "lexer.h"

typedef struct ASTNode ASTNode;

typedef enum {
    AST_PROGRAM,
    AST_FUNCTION,
    AST_VARIABLE,
    AST_BINARY,
    AST_UNARY,
    AST_LITERAL,
    AST_CALL,
    AST_RETURN,
    AST_IF,
    AST_WHILE,
    AST_FOR,
    AST_BLOCK,
    AST_EXPRESSION_STMT,
    AST_NOOP
} ASTNodeType;

struct ASTNode {
    ASTNodeType type;
    union {
        struct { ASTNode **statements; size_t count; } program;
        struct { const char *name; ASTNode **params; size_t param_count; ASTNode *body; } function;
        struct { const char *name; ASTNode *initializer; } variable;
        struct { ASTNode *left; const char *op; ASTNode *right; } binary;
        struct { const char *op; ASTNode *operand; } unary;
        struct { double value; } literal;
        struct { ASTNode *callee; ASTNode **args; size_t arg_count; } call;
        struct { ASTNode *value; } ret;
        struct { ASTNode *condition; ASTNode *then_branch; ASTNode *else_branch; } if_stmt;
        struct { ASTNode *condition; ASTNode *body; } while_stmt;
        struct { ASTNode *init; ASTNode *condition; ASTNode *increment; ASTNode *body; } for_stmt;
        struct { ASTNode **statements; size_t count; } block;
        struct { ASTNode *expression; } expr_stmt;
    } as;
    int line;
    int column;
};

typedef struct {
    Lexer *lexer;
    Token current;
    bool had_error;
    bool panic_mode;
} Parser;

Parser *parser_create(Lexer *lexer);
void parser_destroy(Parser *parser);
ASTNode *parser_parse(Parser *parser);
void ast_node_destroy(ASTNode *node);
void ast_print(ASTNode *node, int indent);
const char *ast_node_type_to_string(ASTNodeType type);

#endif
