#ifndef LEXER_H
#define LEXER_H

#include <stddef.h>

typedef enum {
    TOKEN_EOF = 0,
    TOKEN_IDENTIFIER,
    TOKEN_NUMBER,
    TOKEN_STRING,
    TOKEN_CHAR,
    TOKEN_KEYWORD,
    TOKEN_OPERATOR,
    TOKEN_PUNCTUATION,
    TOKEN_COMMENT,
    TOKEN_ERROR
} TokenType;

typedef struct {
    TokenType type;
    const char *lexeme;
    size_t length;
    int line;
    int column;
    double numeric_value;
} Token;

typedef struct {
    const char *source;
    size_t length;
    size_t position;
    int line;
    int column;
} Lexer;

Lexer *lexer_create(const char *source);
void lexer_destroy(Lexer *lexer);
Token lexer_next(Lexer *lexer);
Token lexer_peek(Lexer *lexer);
void lexer_advance(Lexer *lexer);
char lexer_current(const Lexer *lexer);
bool lexer_is_at_end(const Lexer *lexer);
bool lexer_match(Lexer *lexer, char expected);
const char *token_type_to_string(TokenType type);

#endif
