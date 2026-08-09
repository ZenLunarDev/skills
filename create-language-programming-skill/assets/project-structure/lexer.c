#include "lexer.h"
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <stdbool.h>
#include <stdio.h>

Lexer *lexer_create(const char *source) {
    Lexer *lexer = malloc(sizeof(Lexer));
    if (!lexer) return NULL;
    lexer->source = source;
    lexer->length = strlen(source);
    lexer->position = 0;
    lexer->line = 1;
    lexer->column = 1;
    return lexer;
}

void lexer_destroy(Lexer *lexer) {
    free(lexer);
}

char lexer_current(const Lexer *lexer) {
    if (lexer_is_at_end(lexer)) return '\\0';
    return lexer->source[lexer->position];
}

bool lexer_is_at_end(const Lexer *lexer) {
    return lexer->position >= lexer->length;
}

bool lexer_match(Lexer *lexer, char expected) {
    if (lexer_is_at_end(lexer)) return false;
    if (lexer->source[lexer->position] != expected) return false;
    lexer->position++;
    lexer->column++;
    return true;
}

void lexer_advance(Lexer *lexer) {
    if (lexer_is_at_end(lexer)) return;
    if (lexer->source[lexer->position] == '\\n') {
        lexer->line++;
        lexer->column = 1;
    } else {
        lexer->column++;
    }
    lexer->position++;
}

Token lexer_next(Lexer *lexer) {
    skip_whitespace(lexer);
    if (lexer_is_at_end(lexer)) {
        Token token = {TOKEN_EOF, "", 0, lexer->line, lexer->column, 0};
        return token;
    }

    char c = lexer_current(lexer);
    Token token;

    if (isalpha((unsigned char)c) || c == '_') {
        return lexer_identifier(lexer);
    } else if (isdigit((unsigned char)c)) {
        return lexer_number(lexer);
    } else if (c == '"') {
        return lexer_string(lexer);
    }

    // Single-character tokens
    token.type = TOKEN_PUNCTUATION;
    token.lexeme = &lexer->source[lexer->position];
    token.length = 1;
    token.line = lexer->line;
    token.column = lexer->column;
    token.numeric_value = 0;
    lexer_advance(lexer);
    return token;
}

Token lexer_peek(Lexer *lexer) {
    Token token = lexer_next(lexer);
    lexer->position -= token.length;
    return token;
}

void skip_whitespace(Lexer *lexer) {
    while (!lexer_is_at_end(lexer)) {
        char c = lexer_current(lexer);
        switch (c) {
            case ' ':
            case '\\r':
            case '\\t':
                lexer_advance(lexer);
                break;
            case '\\n':
                lexer_advance(lexer);
                break;
            case '/':
                if (lexer_match(lexer, '/')) {
                    while (!lexer_is_at_end(lexer) && lexer_current(lexer) != '\\n') {
                        lexer_advance(lexer);
                    }
                } else if (lexer_match(lexer, '*')) {
                    while (!lexer_is_at_end(lexer)) {
                        if (lexer_match(lexer, '*') && lexer_match(lexer, '/')) break;
                        lexer_advance(lexer);
                    }
                } else {
                    return;
                }
                break;
            default:
                return;
        }
    }
}

Token lexer_identifier(Lexer *lexer) {
    size_t start = lexer->position;
    while (!lexer_is_at_end(lexer) && (isalnum((unsigned char)lexer_current(lexer)) || lexer_current(lexer) == '_')) {
        lexer_advance(lexer);
    }
    size_t length = lexer->position - start;
    Token token;
    token.type = TOKEN_IDENTIFIER;
    token.lexeme = &lexer->source[start];
    token.length = length;
    token.line = lexer->line;
    token.column = lexer->column - (int)length + 1;
    token.numeric_value = 0;
    return token;
}

Token lexer_number(Lexer *lexer) {
    size_t start = lexer->position;
    while (!lexer_is_at_end(lexer) && isdigit((unsigned char)lexer_current(lexer))) {
        lexer_advance(lexer);
    }
    if (!lexer_is_at_end(lexer) && lexer_current(lexer) == '.') {
        lexer_advance(lexer);
        while (!lexer_is_at_end(lexer) && isdigit((unsigned char)lexer_current(lexer))) {
            lexer_advance(lexer);
        }
    }
    Token token;
    token.type = TOKEN_NUMBER;
    token.lexeme = &lexer->source[start];
    token.length = lexer->position - start;
    token.line = lexer->line;
    token.column = lexer->column - (int)token.length + 1;
    token.numeric_value = strtod(token.lexeme, NULL);
    return token;
}

Token lexer_string(Lexer *lexer) {
    lexer_advance(lexer); // Opening quote
    size_t start = lexer->position;
    while (!lexer_is_at_end(lexer) && lexer_current(lexer) != '"') {
        if (lexer_current(lexer) == '\\\\') {
            lexer_advance(lexer);
        }
        lexer_advance(lexer);
    }
    size_t length = lexer->position - start;
    if (!lexer_is_at_end(lexer)) {
        lexer_advance(lexer); // Closing quote
    }
    Token token;
    token.type = TOKEN_STRING;
    token.lexeme = &lexer->source[start];
    token.length = length;
    token.line = lexer->line;
    token.column = lexer->column - (int)length - 1;
    token.numeric_value = 0;
    return token;
}

const char *token_type_to_string(TokenType type) {
    switch (type) {
        case TOKEN_EOF: return "EOF";
        case TOKEN_IDENTIFIER: return "IDENTIFIER";
        case TOKEN_NUMBER: return "NUMBER";
        case TOKEN_STRING: return "STRING";
        case TOKEN_CHAR: return "CHAR";
        case TOKEN_KEYWORD: return "KEYWORD";
        case TOKEN_OPERATOR: return "OPERATOR";
        case TOKEN_PUNCTUATION: return "PUNCTUATION";
        case TOKEN_COMMENT: return "COMMENT";
        case TOKEN_ERROR: return "ERROR";
        default: return "UNKNOWN";
    }
}
