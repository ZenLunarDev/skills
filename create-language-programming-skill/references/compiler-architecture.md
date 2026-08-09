# Compiler Architecture

## Pipeline Overview

A compiler processes source code through sequential phases. Each phase transforms the program representation and produces diagnostics.

```
Source Code
    |
    v
Lexer -> Parser -> AST -> Semantic Analysis -> Code Generator -> Target Code
```

## Phase 1: Lexical Analysis

### Responsibilities
- Read raw source text
- Group characters into tokens
- Skip whitespace and comments
- Report invalid characters
- Track source locations (line, column)

### Data Structures

```c
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
```

### Implementation Patterns

- Single-pass scanner with lookahead
- Use `peek()` and `consume()` helpers
- Implement `match()` for multi-character operators (`==`, `!=`, `<=`, `>=`)
- Handle string escaping and numeric literals in dedicated functions
- Return `TOKEN_ERROR` for invalid input, including the source position

### Keywords Table
Maintain a sorted keyword table or hash map for O(1) keyword recognition.

## Phase 2: Parsing

### Parser Choice: Recursive Descent
Prefer recursive descent parsing for:
- Clear error recovery
- Easy debugging
- Natural expression of grammar rules
- Good error messages

### Operator Precedence Parsing
For expressions, use precedence climbing:
```c
typedef enum { PREC_NONE, PREC_TERM, PREC_FACTOR, PREC_UNARY, PREC_PRIMARY } Precedence;

ASTNode *parse_expression(int precedence);
ASTNode *parse_precedence(int precedence);
```

### Grammar Notation
Document the grammar in EBNF:
```ebnf
program     = { statement } ;
statement   = expr_stmt | var_decl | func_decl | if_stmt | while_stmt | return_stmt | block ;
expr_stmt   = expression, ";" ;
var_decl    = "var", identifier, [ ":", type ], [ "=", expression ], ";" ;
if_stmt     = "if", "(", expression, ")", block, { "else", "if", block }, [ "else", block ] ;
while_stmt  = "while", "(", expression, ")", block ;
return_stmt = "return", [ expression ], ";" ;
block       = "{", { statement }, "}" ;
expression  = assignment ;
assignment  = identifier, "=", expression | logic_or ;
logic_or    = logic_and, { "||", logic_and } ;
logic_and   = equality, { "&&", equality } ;
equality    = comparison, { ("==" | "!="), comparison } ;
comparison  = addition, { ("<" | ">" | "<=" | ">="), addition } ;
addition     = multiplication, { ("+" | "-"), multiplication } ;
multiplication = unary, { ("*" | "/" | "%"), unary } ;
unary       = ("!" | "-" | "&" | "*"), unary | primary ;
primary     = number | string | identifier | "(", expression, ")" | call ;
call        = identifier, "(", [ argument_list ], ")" ;
```

### Error Recovery
- On unexpected token, synchronize to a known safe point (e.g., semicolon, closing brace)
- Report the error but continue parsing to find more errors
- Track error count; exit if error count exceeds threshold

## Phase 3: Abstract Syntax Tree

### Design Principles
- Use tagged unions for node types
- Every heap-allocated node must have a destroy function
- Preserve source locations in every node for error reporting
- Keep AST independent of parsing and code generation

### Node Types

```c
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
```

### Memory Management
- Provide `ast_node_destroy(ASTNode *node)` that recursively frees all children
- Use arena allocation for temporary nodes during parsing
- Call destroy only at the end of compilation

### Traversal
- Implement recursive `ast_visit(ASTNode *node, VisitorFunc func, void *ctx)` for semantic analysis
- Implement `ast_print(ASTNode *node, int indent)` for debugging

## Phase 4: Semantic Analysis

### Symbol Table
```c
typedef struct Symbol {
    const char *name;
    SymbolKind kind; // VARIABLE, FUNCTION, TYPE, PARAMETER
    Type *type;
    bool is_global;
    bool is_initialized;
    struct Symbol *next; // Hash chain
} Symbol;

typedef struct {
    Symbol **buckets;
    size_t capacity;
    size_t count;
} SymbolTable;
```

### Type System
Define a simple type representation:
```c
typedef enum {
    TYPE_ERROR,
    TYPE_VOID,
    TYPE_BOOL,
    TYPE_INT,
    TYPE_FLOAT,
    TYPE_STRING,
    TYPE_ARRAY,
    TYPE_FUNCTION,
    TYPE_STRUCT,
    TYPE_POINTER
} TypeKind;

typedef struct Type {
    TypeKind kind;
    struct Type *subtype; // For arrays, pointers, function returns
    struct Type **param_types; // For functions
    size_t param_count;
} Type;
```

### Validation Steps
1. Resolve all identifiers to declarations
2. Check function calls against signatures
3. Verify assignment type compatibility
4. Check control flow reachability
5. Validate return statements against function return type
6. Ensure variables are initialized before use

### Error Reporting
Collect errors in a list rather than failing immediately:
```c
typedef struct {
    const char **messages;
    size_t count;
    size_t capacity;
} ErrorList;
```

## Phase 5: Code Generation

### Strategy: C Code Emission
Emit C code as the target for maximum portability and simplicity.

### Output Structure
```c
// Includes
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "runtime.h"

// Forward declarations
static void execute_program(ASTNode *program);

// Main
int main(int argc, char **argv) {
    // Runtime initialization
    execute_program(ast_root);
    return 0;
}
```

### Expression Generation
- Each AST node type has a dedicated emit function
- Expressions emit to a temporary register or stack
- Statements emit directly to the output stream
- Track indentation level for formatting

### Runtime Library
Provide a minimal runtime:
```c
// runtime.h
void runtime_print_string(const char *s);
void runtime_print_int(int64_t value);
void runtime_assert(bool condition, const char *message);
void *runtime_alloc(size_t size);
void runtime_free(void *ptr);
```

## Phase 6: Virtual Machine (Interpreted Languages)

### Bytecode Design
```c
typedef enum {
    OP_PUSH_CONST,
    OP_POP,
    OP_ADD,
    OP_SUB,
    OP_MUL,
    OP_DIV,
    OP_CALL,
    OP_RETURN,
    OP_JUMP,
    OP_JUMP_IF_FALSE,
    OP_GET_GLOBAL,
    OP_SET_GLOBAL,
    OP_GET_LOCAL,
    OP_SET_LOCAL
} OpCode;
```

### Stack Machine
- Operand stack for expression evaluation
- Call stack for function frames
- Each frame contains locals and the return address

### Execution Loop
```c
while (running) {
    OpCode op = (OpCode)chunk->code[ip++];
    switch (op) {
        case OP_PUSH_CONST:
            push(vm, chunk->constants[READ_BYTE()]);
            break;
        case OP_ADD: {
            Value b = pop(vm);
            Value a = pop(vm);
            push(vm, value_add(a, b));
            break;
        }
        // ... other opcodes
    }
}
```

## Testing Strategy

### Unit Tests
- Test lexer tokenization with edge cases
- Test parser with valid and invalid syntax
- Test AST node creation and destruction
- Test semantic analysis error detection
- Test code generation output formatting

### Integration Tests
- End-to-end compilation of complete programs
- Verify output matches expected results
- Test error messages for common mistakes

### Test Organization
```c
// tests/unit/test_lexer.c
void test_lexer_single_char_tokens(void);
void test_lexer_keywords(void);
void test_lexer_numbers(void);
void test_lexer_strings(void);
void test_lexer_comments(void);

// tests/integration/test_compile_run.c
void test_hello_world(void);
void test_arithmetic(void);
void test_functions(void);
```

## Build System

### Makefile Targets
- `make` - Build release binary
- `make debug` - Build debug binary with symbols
- `make test` - Build and run tests
- `make clean` - Remove build artifacts
- `make format` - Format source with clang-format

### Dependencies
- C11 compiler (gcc, clang, msvc)
- Make
- Optional: clang-format, valgrind, address sanitizer
