#!/usr/bin/env python3
import os
import sys
import argparse

def write_file(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created: {path}")

def create_project(language_name, output_dir):
    base = os.path.join(output_dir, language_name)
    src = os.path.join(base, "src")
    include = os.path.join(base, "include")
    lib = os.path.join(base, "lib", "std")
    tests = os.path.join(base, "tests", "unit")
    examples = os.path.join(base, "examples")
    docs = os.path.join(base, "docs")
    assets = os.path.join(base, "assets")

    dirs = [src, include, lib, tests, examples, docs, assets]
    for d in dirs:
        os.makedirs(d, exist_ok=True)

    makefile = """CC = gcc
CFLAGS = -Wall -Wextra -std=c11 -O2 -Iinclude
LDFLAGS =
SRC_DIR = src
TEST_DIR = tests
BIN = bin/%(lang)s
TEST_BIN = bin/%(lang)s_test

.PHONY: all clean test debug release

all: release

debug: CFLAGS += -g -DDEBUG
debug: $(BIN)

release: CFLAGS += -O2 -DNDEBUG
release: $(BIN)

$(BIN): $(wildcard $(SRC_DIR)/*.c) $(wildcard include/*.h)
\t@mkdir -p bin
\t$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)

test: $(BIN)
\t@mkdir -p bin
\t$(CC) $(CFLAGS) -o $(TEST_BIN) $(TEST_DIR)/*.c $(SRC_DIR)/*.c $(LDFLAGS)
\t./$(TEST_BIN)

clean:
\trm -rf bin
""" % {"lang": language_name}

    readme = """# %(lang)s

A new programming language implemented in C.

## Building

```bash
make release   # Optimized build
make debug     # Debug build
make test      # Run tests
make clean     # Clean build artifacts
```

## Project Structure

```
src/            - Compiler/interpreter implementation
include/        - Public API headers
lib/std/        - Standard library
tests/          - Unit and integration tests
examples/       - Example programs
docs/           - Documentation
```

## License

MIT
""" % {"lang": language_name}

    license = """MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""

    main_c = """#include <stdio.h>
#include <stdlib.h>
#include "language.h"

int main(int argc, char **argv) {
    printf("%(lang)s compiler/interpreter\\n");
    return 0;
}
""" % {"lang": language_name}

    language_h = """#ifndef LANGUAGE_H
#define LANGUAGE_H

#include <stddef.h>

typedef struct {
    const char *name;
    int version_major;
    int version_minor;
} LanguageInfo;

LanguageInfo language_get_info(void);
int language_init(void);
void language_cleanup(void);

#endif
"""

    lexer_h = """#ifndef LEXER_H
#define LEXER_H

#include <stddef.h>

typedef enum {
    TOKEN_EOF,
    TOKEN_IDENTIFIER,
    TOKEN_NUMBER,
    TOKEN_STRING,
    TOKEN_KEYWORD,
    TOKEN_OPERATOR,
    TOKEN_PUNCTUATION,
    TOKEN_ERROR
} TokenType;

typedef struct {
    TokenType type;
    const char *lexeme;
    int line;
    int column;
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
Token lexer_next_token(Lexer *lexer);
const char *token_type_to_string(TokenType type);

#endif
"""

    lexer_c = """#include "lexer.h"
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

Lexer *lexer_create(const char *source) {
    Lexer *lexer = malloc(sizeof(Lexer));
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

Token lexer_next_token(Lexer *lexer) {
    (void)lexer;
    Token token;
    token.type = TOKEN_EOF;
    token.lexeme = "";
    token.line = lexer->line;
    token.column = lexer->column;
    return token;
}

const char *token_type_to_string(TokenType type) {
    switch (type) {
        case TOKEN_EOF: return "EOF";
        case TOKEN_IDENTIFIER: return "IDENTIFIER";
        case TOKEN_NUMBER: return "NUMBER";
        case TOKEN_STRING: return "STRING";
        case TOKEN_KEYWORD: return "KEYWORD";
        case TOKEN_OPERATOR: return "OPERATOR";
        case TOKEN_PUNCTUATION: return "PUNCTUATION";
        case TOKEN_ERROR: return "ERROR";
        default: return "UNKNOWN";
    }
}
"""

    parser_h = """#ifndef PARSER_H
#define PARSER_H

#include "lexer.h"

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

typedef struct ASTNode ASTNode;

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
};

ASTNode *parser_create(Lexer *lexer);
void parser_destroy(ASTNode *ast);
ASTNode *parser_parse(ASTNode *parser);
void ast_node_destroy(ASTNode *node);

#endif
"""

    parser_c = """#include "parser.h"
#include <stdlib.h>
#include <string.h>

ASTNode *parser_create(Lexer *lexer) {
    (void)lexer;
    return NULL;
}

void parser_destroy(ASTNode *ast) {
    (void)ast;
}

ASTNode *parser_parse(ASTNode *parser) {
    (void)parser;
    return NULL;
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
            for (size_t i = 0; i < node->as.function.param_count; i++) {
                ast_node_destroy(node->as.function.params[i]);
            }
            free(node->as.function.params);
            ast_node_destroy(node->as.function.body);
            break;
        default:
            break;
    }
    free(node);
}
"""

    ast_h = """#ifndef AST_H
#define AST_H

#include "parser.h"

void ast_print(ASTNode *node, int indent);
const char *ast_node_type_to_string(ASTNodeType type);

#endif
"""

    ast_c = """#include "ast.h"
#include <stdio.h>

void ast_print(ASTNode *node, int indent) {
    (void)node;
    (void)indent;
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
"""

    semantic_h = """#ifndef SEMANTIC_H
#define SEMANTIC_H

#include "parser.h"

typedef struct {
    const char **errors;
    size_t error_count;
    size_t error_capacity;
} SemanticErrorList;

int semantic_analyze(ASTNode *ast, SemanticErrorList *errors);
void semantic_error_list_destroy(SemanticErrorList *list);

#endif
"""

    semantic_c = """#include "semantic.h"
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

int semantic_analyze(ASTNode *ast, SemanticErrorList *errors) {
    (void)ast;
    (void)errors;
    return 0;
}

void semantic_error_list_destroy(SemanticErrorList *list) {
    if (!list) return;
    for (size_t i = 0; i < list->error_count; i++) {
        free((void *)list->errors[i]);
    }
    free(list->errors);
    free(list);
}
"""

    codegen_h = """#ifndef CODEGEN_H
#define CODEGEN_H

#include "parser.h"

int codegen_generate(ASTNode *ast, const char *output_path);
void codegen_error(const char *message);

#endif
"""

    codegen_c = """#include "codegen.h"
#include <stdio.h>
#include <stdlib.h>

int codegen_generate(ASTNode *ast, const char *output_path) {
    (void)ast;
    FILE *fp = fopen(output_path, "w");
    if (!fp) {
        codegen_error("Cannot open output file");
        return -1;
    }
    fprintf(fp, "// Generated by %(lang)s compiler\\n", "%(lang)s");
    fclose(fp);
    return 0;
}

void codegen_error(const char *message) {
    fprintf(stderr, "Error: %s\\n", message);
}
""" % {"lang": language_name}

    utils_h = """#ifndef UTILS_H
#define UTILS_H

#include <stddef.h>

char *read_file(const char *path);
void report_error(const char *filename, int line, int column, const char *message);

#endif
"""

    utils_c = """#include "utils.h"
#include <stdio.h>
#include <stdlib.h>

char *read_file(const char *path) {
    FILE *fp = fopen(path, "rb");
    if (!fp) return NULL;
    fseek(fp, 0, SEEK_END);
    long size = ftell(fp);
    fseek(fp, 0, SEEK_SET);
    char *buffer = malloc(size + 1);
    if (!buffer) {
        fclose(fp);
        return NULL;
    }
    fread(buffer, 1, size, fp);
    buffer[size] = '\\0';
    fclose(fp);
    return buffer;
}

void report_error(const char *filename, int line, int column, const char *message) {
    fprintf(stderr, "%s:%d:%d: error: %s\\n", filename, line, column, message);
}
"""

    write_file(os.path.join(base, "Makefile"), makefile)
    write_file(os.path.join(base, "README.md"), readme)
    write_file(os.path.join(base, "LICENSE"), license)
    write_file(os.path.join(src, "main.c"), main_c)
    write_file(os.path.join(include, "language.h"), language_h)
    write_file(os.path.join(src, "lexer.c"), lexer_c)
    write_file(os.path.join(include, "lexer.h"), lexer_h)
    write_file(os.path.join(src, "parser.c"), parser_c)
    write_file(os.path.join(include, "parser.h"), parser_h)
    write_file(os.path.join(src, "ast.c"), ast_c)
    write_file(os.path.join(include, "ast.h"), ast_h)
    write_file(os.path.join(src, "semantic.c"), semantic_c)
    write_file(os.path.join(include, "semantic.h"), semantic_h)
    write_file(os.path.join(src, "codegen.c"), codegen_c)
    write_file(os.path.join(include, "codegen.h"), codegen_h)
    write_file(os.path.join(src, "utils.c"), utils_c)
    write_file(os.path.join(include, "utils.h"), utils_h)

    test_c = """#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "../src/lexer.h"
#include "../src/ast.h"

static int test_count = 0;
static int pass_count = 0;

#define TEST(name) do { \\
    test_count++; \\
    printf("Running: %s... ", name); \\
} while(0)

#define ASSERT(cond) do { \\
    if (!(cond)) { \\
        printf("FAILED at %s:%d\\n", __FILE__, __LINE__); \\
        return 1; \\
    } \\
} while(0)

#define PASS() do { \\
    pass_count++; \\
    printf("PASSED\\n"); \\
} while(0)

int main(void) {
    printf("\\n=== %(lang)s Test Suite ===\\n\\n", "%(lang)s");

    TEST("lexer_creates_instance") {
        Lexer *lexer = lexer_create("test");
        ASSERT(lexer != NULL);
        ASSERT(lexer->position == 0);
        lexer_destroy(lexer);
        PASS();
    }

    TEST("token_type_to_string") {
        ASSERT(strcmp(token_type_to_string(TOKEN_EOF), "EOF") == 0);
        ASSERT(strcmp(token_type_to_string(TOKEN_IDENTIFIER), "IDENTIFIER") == 0);
        PASS();
    }

    printf("\\n=== Results: %d/%d passed ===\\n\\n", pass_count, test_count);
    return test_count - pass_count;
}
""" % {"lang": language_name}

    write_file(os.path.join(tests, "test_main.c"), test_c)

    example_lang = """# This is an example %(lang)s program
# Add your language syntax here

func main() {
    print("Hello, World!")
}
""" % {"lang": language_name}

    write_file(os.path.join(examples, "hello.%(lang)s"), example_lang % {"lang": language_name})

    print(f"\\nProject scaffolded at: {base}")
    print(f"Next steps: cd {base} && make debug")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Initialize a new programming language project in C")
    parser.add_argument("name", help="Name of the programming language")
    parser.add_argument("--path", default=".", help="Output directory (default: current directory)")
    args = parser.parse_args()
    create_project(args.name, args.path)
