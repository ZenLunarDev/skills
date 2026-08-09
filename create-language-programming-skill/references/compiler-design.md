# Compiled Language Design

Detailed specifications for implementing a compiled language in C.

## Target Selection

### C Code Emission (Recommended for First Implementation)

Emit C code as the target language. This provides maximum portability and leverages existing C compilers.

**Advantages**:
- No need to implement register allocation or instruction selection
- Leverages C compiler optimizations
- Easy debugging (compile emitted C with -g)
- Portable across platforms

**Disadvantages**:
- Slower compilation (two-pass: your compiler + C compiler)
- Larger binary size (includes C runtime)

### Direct Machine Code (Advanced)

Generate assembly or machine code directly.

**When to use**:
- Performance is critical
- Target platform is known
- Experience with assembly is available

**Skip for first implementation.**

## C Code Emission Strategy

### Runtime Header

Create `lib/std/runtime.h`:

```c
#ifndef RUNTIME_H
#define RUNTIME_H

#include <stddef.h>
#include <stdbool.h>

// Memory
void *runtime_alloc(size_t size);
void runtime_free(void *ptr);
void *runtime_realloc(void *ptr, size_t new_size);

// I/O
void runtime_print_string(const char *s);
void runtime_print_int(int64_t value);
void runtime_print_float(double value);
void runtime_print_bool(bool value);
void runtime_print_newline(void);

// String operations
char *runtime_string_concat(const char *a, const char *b);
int runtime_string_compare(const char *a, const char *b);
size_t runtime_string_length(const char *s);

// Array operations
void *runtime_array_create(size_t element_size, size_t count);
void runtime_array_free(void *array);
size_t runtime_array_length(void *array);

// Assertions
void runtime_assert(bool condition, const char *message);

// Exit
void runtime_exit(int code);

#endif
```

### Runtime Implementation

Create `lib/std/runtime.c`:

```c
#include "runtime.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>

void *runtime_alloc(size_t size) {
    void *ptr = malloc(size);
    if (!ptr) {
        fprintf(stderr, "Out of memory\n");
        runtime_exit(1);
    }
    return ptr;
}

void runtime_free(void *ptr) {
    free(ptr);
}

void *runtime_realloc(void *ptr, size_t new_size) {
    void *result = realloc(ptr, new_size);
    if (!result && new_size > 0) {
        fprintf(stderr, "Out of memory\n");
        runtime_exit(1);
    }
    return result;
}

void runtime_print_string(const char *s) {
    if (s) fputs(s, stdout);
}

void runtime_print_int(int64_t value) {
    printf("%" PRId64, value);
}

void runtime_print_float(double value) {
    printf("%g", value);
}

void runtime_print_bool(bool value) {
    fputs(value ? "true" : "false", stdout);
}

void runtime_print_newline(void) {
    putchar('\n');
}

char *runtime_string_concat(const char *a, const char *b) {
    size_t len_a = strlen(a);
    size_t len_b = strlen(b);
    char *result = runtime_alloc(len_a + len_b + 1);
    memcpy(result, a, len_a);
    memcpy(result + len_a, b, len_b);
    result[len_a + len_b] = '\0';
    return result;
}

int runtime_string_compare(const char *a, const char *b) {
    return strcmp(a, b);
}

size_t runtime_string_length(const char *s) {
    return strlen(s);
}

void *runtime_array_create(size_t element_size, size_t count) {
    return runtime_alloc(element_size * count);
}

void runtime_array_free(void *array) {
    runtime_free(array);
}

size_t runtime_array_length(void *array) {
    (void)array;
    // Arrays need length tracking; use header or separate length variable
    return 0;
}

void runtime_assert(bool condition, const char *message) {
    if (!condition) {
        fprintf(stderr, "Assertion failed: %s\n", message);
        runtime_exit(1);
    }
}

void runtime_exit(int code) {
    exit(code);
}
```

### Code Generator Structure

```c
// src/codegen.c

typedef struct {
    FILE *fp;
    int indent;
    bool had_error;
} CodeGen;

void codegen_init(CodeGen *cg, const char *path) {
    cg->fp = fopen(path, "w");
    cg->indent = 0;
    cg->had_error = false;
    fprintf(cg->fp, "#include <stdio.h>\n");
    fprintf(cg->fp, "#include <stdlib.h>\n");
    fprintf(cg->fp, "#include <stdint.h>\n");
    fprintf(cg->fp, "#include <stdbool.h>\n");
    fprintf(cg->fp, "#include \"runtime.h\"\n\n");
}

void codegen_emit(CodeGen *cg, const char *fmt, ...) {
    for (int i = 0; i < cg->indent; i++) fprintf(cg->fp, "  ");
    va_list args;
    va_start(args, fmt);
    vfprintf(cg->fp, fmt, args);
    va_end(args);
    fprintf(cg->fp, "\n");
}

void codegen_generate_function(CodeGen *cg, ASTNode *node) {
    // Emit function signature
    codegen_emit(cg, "static %s %s(%s) {",
        type_to_c_string(node->as.function.return_type),
        node->as.function.name,
        params_to_c_string(node->as.function.params));

    cg->indent++;
    // Emit body
    codegen_generate_block(cg, node->as.function.body);
    cg->indent--;

    codegen_emit(cg, "}");
    codegen_emit(cg, "");
}

void codegen_generate_expression(CodeGen *cg, ASTNode *node) {
    switch (node->type) {
        case AST_LITERAL:
            fprintf(cg->fp, "%g", node->as.literal.value);
            break;
        case AST_IDENTIFIER:
            fprintf(cg->fp, "%s", node->as.identifier.name);
            break;
        case AST_BINARY:
            fprintf(cg->fp, "(");
            codegen_generate_expression(cg, node->as.binary.left);
            fprintf(cg->fp, " %s ", node->as.binary.op);
            codegen_generate_expression(cg, node->as.binary.right);
            fprintf(cg->fp, ")");
            break;
        // ... other cases
    }
}
```

### Main Function Template

Emit this at the start of generated C:

```c
int main(int argc, char **argv) {
    if (argc < 2) {
        fprintf(stderr, "Usage: %s <file>\n", argv[0]);
        return 1;
    }
    
    // Runtime initialization
    runtime_init();
    
    // Execute user main function
    int result = user_main();
    
    // Runtime cleanup
    runtime_cleanup();
    
    return result;
}
```

## Optimization Strategies

### Level 1: No Optimization

Emit straightforward C code. Trust the C compiler for optimization.

### Level 2: Peephole Optimization

Simplify expression trees before emission:
- Constant folding: `2 + 3` -> `5`
- Algebraic simplification: `x * 1` -> `x`
- Dead code elimination: remove unused variables

### Level 3: Simple Optimizations

- Common subexpression elimination
- Loop invariant code motion
- Inline small functions

## Multi-file Compilation

For languages with modules:

1. Compile each module to a `.c` file
2. Compile each `.c` file to `.o` with system C compiler
3. Link all `.o` files together

```makefile
%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

$(BIN): $(OBJECTS)
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)
```

## Debug Information

Emit debug info in comments:

```c
// #line 10 "input.lang"
```

This helps debuggers point to original source.

## Error Handling in Generated Code

For compiled languages, generate runtime checks:

```c
// Array bounds check
if (index < 0 || index >= array_length) {
    fprintf(stderr, "Index out of bounds: %d\n", index);
    runtime_exit(1);
}
```

## Build Integration

After generating C code:

1. Write generated C to `build/output.c`
2. Compile with: `gcc -Wall -Wextra -O2 -o build/output build/output.c lib/std/runtime.c`
3. Run: `./build/output`

## Troubleshooting

### Emitted C does not compile

1. Check for missing includes
2. Check for type mismatches
3. Check for undeclared variables
4. Compile with `-fsyntax-only` to see errors without linking

### Generated binary crashes

1. Run with gdb: `gdb ./build/output`
2. Check for null pointer dereferences
3. Check for stack overflows (deep recursion)
4. Check for memory corruption

### Performance is poor

1. Profile with `perf` or `valgrind --tool=callgrind`
2. Check for excessive memory allocation
3. Check for unnecessary copies
4. Consider adding optimization level to generated C
