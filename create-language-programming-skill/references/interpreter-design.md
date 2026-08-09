# Interpreter Design

Detailed specifications for implementing an interpreted language in C.

## Execution Strategy Selection

### Tree-Walking Interpreter

Execute AST nodes directly without compilation to bytecode.

**Advantages**:
- Simple to implement
- Easy to debug (step through AST)
- Good error messages
- Quick to implement

**Disadvantages**:
- Slower execution
- Harder to optimize

**Use when**: Prototyping, educational languages, or when performance is not critical.

### Bytecode Virtual Machine

Compile AST to bytecode, then execute bytecode in a VM.

**Advantages**:
- Faster execution than tree-walking
- Easier to optimize
- Portable bytecode format

**Disadvantages**:
- More complex implementation
- Two compilation phases

**Use when**: Performance matters or you want to ship bytecode.

## Tree-Walking Interpreter

### Value Representation

```c
typedef enum {
    VAL_NIL,
    VAL_BOOL,
    VAL_NUMBER,
    VAL_STRING,
    VAL_FUNCTION,
    VAL_CLOSURE,
    VAL_NATIVE,
    VAL_ARRAY,
    VAL_MAP
} ValueType;

typedef struct {
    ValueType type;
    union {
        bool boolean;
        double number;
        struct { char *chars; size_t length; } string;
        struct { ObjFunction *function; } obj;
    } as;
} Value;

typedef struct Obj Obj;
struct Obj {
    ObjType type;
    bool is_marked;
    Obj *next;
};

typedef struct {
    ObjFunction *function;
    ObjUpvalue **upvalues;
    int upvalue_count;
} ObjClosure;
```

### Environment (Variable Storage)

```c
typedef struct {
    ObjString *name;
    Value value;
} Entry;

typedef struct {
    Entry *entries;
    size_t count;
    size_t capacity;
    bool is_local;
} Table;

typedef struct Env {
    Table table;
    struct Env *enclosing;
} Env;
```

### Interpreter Loop

```c
typedef struct {
    ObjFunction *function;
    const char *source;
    Value *ip;  // Instruction pointer
    Value *sp;  // Stack pointer
    Value stack[STACK_MAX];
    Env *env;
    Table globals;
    ObjUpvalue *open_upvalues;
    bool had_error;
    bool panic_mode;
} VM;

void vm_init(VM *vm) {
    vm->sp = vm->stack;
    vm->env = NULL;
    vm->had_error = false;
    vm->panic_mode = false;
}

void vm_run(VM *vm, ObjFunction *function) {
    vm->function = function;
    vm->ip = function->chunk.code;
    vm->env = env_new(&vm->globals, NULL);

    // Push function as first value for return address tracking
    push(vm, OBJ_VAL(function));

    execute(vm);

    env_free(vm->env);
}
```

### Execution Function

```c
static Value execute(VM *vm) {
#define READ_BYTE() (*vm->ip++)
#define READ_SHORT() (vm->ip += 2, (uint16_t)((vm->ip[-2] << 8) | vm->ip[-1]))
#define READ_CONSTANT() (vm->function->chunk.constants.values[READ_BYTE()])
#define READ_STRING() AS_STRING(READ_CONSTANT())

    for (;;) {
        switch (READ_BYTE()) {
            case OP_CONSTANT: {
                Value constant = READ_CONSTANT();
                push(vm, constant);
                break;
            }
            case OP_ADD: {
                Value b = pop(vm);
                Value a = pop(vm);
                if (IS_NUMBER(a) && IS_NUMBER(b)) {
                    push(vm, NUMBER_VAL(AS_NUMBER(a) + AS_NUMBER(b)));
                } else if (IS_STRING(a) && IS_STRING(b)) {
                    push(vm, STRING_VAL(string_concat(AS_STRING(a), AS_STRING(b))));
                } else {
                    runtime_error(vm, "Operands must be two numbers or two strings.");
                }
                break;
            }
            case OP_SUBTRACT: {
                Value b = pop(vm);
                Value a = pop(vm);
                if (IS_NUMBER(a) && IS_NUMBER(b)) {
                    push(vm, NUMBER_VAL(AS_NUMBER(a) - AS_NUMBER(b)));
                } else {
                    runtime_error(vm, "Operands must be numbers.");
                }
                break;
            }
            case OP_MULTIPLY: {
                Value b = pop(vm);
                Value a = pop(vm);
                if (IS_NUMBER(a) && IS_NUMBER(b)) {
                    push(vm, NUMBER_VAL(AS_NUMBER(a) * AS_NUMBER(b)));
                } else {
                    runtime_error(vm, "Operands must be numbers.");
                }
                break;
            }
            case OP_DIVIDE: {
                Value b = pop(vm);
                Value a = pop(vm);
                if (IS_NUMBER(a) && IS_NUMBER(b)) {
                    if (AS_NUMBER(b) == 0) {
                        runtime_error(vm, "Division by zero.");
                    }
                    push(vm, NUMBER_VAL(AS_NUMBER(a) / AS_NUMBER(b)));
                } else {
                    runtime_error(vm, "Operands must be numbers.");
                }
                break;
            }
            case OP_NEGATE: {
                Value value = pop(vm);
                if (IS_NUMBER(value)) {
                    push(vm, NUMBER_VAL(-AS_NUMBER(value)));
                } else {
                    runtime_error(vm, "Operand must be a number.");
                }
                break;
            }
            case OP_RETURN: {
                Value result = pop(vm);
                // Close upvalues for this function
                ObjClosure *closure = AS_CLOSURE(vm->stack[0]);
                close_upvalues(vm, vm->sp);
                // Pop function and return
                pop(vm); // Remove function
                return result;
            }
            case OP_PRINT: {
                Value value = pop(vm);
                print_value(stdout, value);
                printf("\n");
                break;
            }
            // ... more opcodes
        }
    }

#undef READ_BYTE
#undef READ_SHORT
#undef READ_CONSTANT
#undef READ_STRING
}
```

## Bytecode Virtual Machine

### Bytecode Design

```c
typedef enum {
    OP_CONSTANT,
    OP_NIL,
    OP_TRUE,
    OP_FALSE,
    OP_POP,
    OP_GET_GLOBAL,
    OP_SET_GLOBAL,
    OP_GET_LOCAL,
    OP_SET_LOCAL,
    OP_GET_UPVALUE,
    OP_SET_UPVALUE,
    OP_GET_PROPERTY,
    OP_SET_PROPERTY,
    OP_GET_SUPER,
    OP_EQUAL,
    OP_GREATER,
    OP_LESS,
    OP_ADD,
    OP_SUBTRACT,
    OP_MULTIPLY,
    OP_DIVIDE,
    OP_NOT,
    OP_NEGATE,
    OP_PRINT,
    OP_JUMP,
    OP_JUMP_IF_FALSE,
    OP_LOOP,
    OP_CALL,
    OP_INVOKE,
    OP_SUPER_INVOKE,
    OP_CLOSURE,
    OP_CLOSE_UPVALUE,
    OP_RETURN,
    OP_CLASS,
    OP_INHERIT,
    OP_METHOD
} OpCode;
```

### Compiler to Bytecode

```c
typedef struct {
    Chunk *chunk;
    Env *env;
    ObjFunction *function;
    bool had_error;
} Compiler;

void compile(Compiler *compiler, ASTNode *node) {
    switch (node->type) {
        case AST_BINARY: {
            compile(compiler, node->as.binary.left);
            compile(compiler, node->as.binary.right);
            emit_byte(compiler, get_opcode(node->as.binary.op));
            break;
        }
        case AST_LITERAL: {
            emit_constant(compiler, NUMBER_VAL(node->as.literal.value));
            break;
        }
        case AST_IDENTIFIER: {
            Value value;
            if (env_get(compiler->env, node->as.identifier.name, &value)) {
                emit_bytes(compiler, OP_GET_LOCAL, AS_LOCAL(value));
            } else {
                emit_bytes(compiler, OP_GET_GLOBAL, identifier_constant(compiler, node->as.identifier.name));
            }
            break;
        }
        // ... other cases
    }
}
```

### Chunk (Bytecode Container)

```c
typedef struct {
    uint8_t *code;
    size_t count;
    size_t capacity;
    ValueArray constants;
    int *lines;
} Chunk;

void chunk_init(Chunk *chunk) {
    chunk->count = 0;
    chunk->capacity = 0;
    chunk->code = NULL;
    chunk->lines = NULL;
    init_value_array(&chunk->constants);
}

void chunk_write(Chunk *chunk, uint8_t byte, int line) {
    if (chunk->count >= chunk->capacity) {
        chunk->capacity = chunk->capacity == 0 ? 8 : chunk->capacity * 2;
        chunk->code = realloc(chunk->code, chunk->capacity);
        chunk->lines = realloc(chunk->lines, chunk->capacity * sizeof(int));
    }
    chunk->code[chunk->count] = byte;
    chunk->lines[chunk->count] = line;
    chunk->count++;
}

int chunk_add_constant(Chunk *chunk, Value value) {
    write_value_array(&chunk->constants, value);
    return chunk->constants.count - 1;
}
```

### Garbage Collection

For managed languages, implement simple mark-and-sweep GC:

```c
void gc_collect(VM *vm) {
    mark_roots(vm);
    trace_references();
    sweep();
}

void mark_roots(VM *vm) {
    for (Value *slot = vm->stack; slot < vm->sp; slot++) {
        mark_value(*slot);
    }
    for (int i = 0; i < vm->frame_count; i++) {
        mark_object((Obj *)vm->frames[i].closure);
    }
    for (ObjUpvalue *upvalue = vm->open_upvalues; upvalue != NULL; upvalue = upvalue->next) {
        mark_object((Obj *)upvalue);
    }
    mark_table(&vm->globals);
    mark_compiler_roots();
}
```

## REPL Implementation

```c
int main(int argc, char **argv) {
    VM vm;
    vm_init(&vm);

    if (argc == 1) {
        // REPL mode
        printf("Welcome to MyLang v0.1.0\n");
        for (;;) {
            printf("> ");
            char line[1024];
            if (!fgets(line, sizeof(line), stdin)) {
                printf("\n");
                break;
            }
            
            // Remove newline
            line[strcspn(line, "\n")] = '\0';
            
            if (strcmp(line, "exit") == 0) break;
            if (strcmp(line, "") == 0) continue;
            
            interpret(&vm, line);
            
            if (vm.had_error) {
                vm.had_error = false;
            }
        }
    } else {
        // File mode
        const char *source = read_file(argv[1]);
        interpret(&vm, source);
    }

    vm_free(&vm);
    return 0;
}
```

## Standard Library for Interpreted Languages

### I/O Functions

```c
// Built-in functions exposed to user code
static Value native_print(int arg_count, Value *args) {
    for (int i = 0; i < arg_count; i++) {
        print_value(stdout, args[i]);
        printf(" ");
    }
    printf("\n");
    return NIL_VAL;
}

static Value native_read_line(int arg_count, Value *args) {
    (void)arg_count;
    (void)args;
    char buffer[1024];
    if (fgets(buffer, sizeof(buffer), stdin)) {
        buffer[strcspn(buffer, "\n")] = '\0';
        return STRING_VAL(buffer);
    }
    return NIL_VAL;
}
```

### Math Functions

```c
static Value native_sqrt(int arg_count, Value *args) {
    if (arg_count != 1 || !IS_NUMBER(args[0])) {
        runtime_error(vm, "sqrt expects 1 number");
        return NIL_VAL;
    }
    return NUMBER_VAL(sqrt(AS_NUMBER(args[0])));
}

static Value native_floor(int arg_count, Value *args) {
    if (arg_count != 1 || !IS_NUMBER(args[0])) {
        runtime_error(vm, "floor expects 1 number");
        return NIL_VAL;
    }
    return NUMBER_VAL(floor(AS_NUMBER(args[0])));
}
```

## Error Handling

### Runtime Errors

```c
void runtime_error(VM *vm, const char *format, ...) {
    va_list args;
    va_start(args, format);
    vfprintf(stderr, format, args);
    va_end(args);
    fputs("\n", stderr);

    // Print stack trace
    for (int i = vm->frame_count - 1; i >= 0; i--) {
        ObjFunction *function = vm->frames[i].closure->function;
        size_t instruction = vm->frames[i].ip - function->chunk.code - 1;
        fprintf(stderr, "[line %d] in ", function->chunk.lines[instruction]);
        if (function->name) {
            fprintf(stderr, "%s()\n", function->name->chars);
        } else {
            fprintf(stderr, "<script>\n");
        }
    }

    vm->had_error = true;
    vm->panic_mode = true;
}
```

### Exception Handling (Optional)

If implementing exceptions:

```c
case OP_TRY: {
    uint16_t jump = READ_SHORT();
    if (vm->exception_thrown) {
        vm->ip = vm->function->chunk.code + jump;
        vm->exception_thrown = false;
    }
    break;
}

case OP_THROW: {
    Value exception = pop(vm);
    vm->exception = exception;
    vm->exception_thrown = true;
    break;
}
```

## Performance Optimization

### JIT Compilation (Advanced)

For hot functions, compile to machine code at runtime. This is complex; skip for first implementation.

### Caching

Cache compiled bytecode to disk:

```c
// Save bytecode
write_bytecode("output.bc", function->chunk);

// Load bytecode
chunk = read_bytecode("output.bc");
```

### Garbage Collection Tuning

- Start GC when heap reaches 512KB
- Increase heap size by 2x after each GC
- Use generational GC if allocation patterns are known

## Troubleshooting

### Stack Overflow

Limit recursion depth:

```c
#define MAX_RECURSION_DEPTH 64

if (vm->frame_count >= MAX_RECURSION_DEPTH) {
    runtime_error(vm, "Maximum recursion depth exceeded.");
}
```

### Memory Leaks

Use a GC or implement manual memory tracking. For manual tracking:

```c
typedef struct {
    void *ptr;
    size_t size;
} Allocation;

Allocation allocations[ALLOCATION_MAX];
size_t allocation_count = 0;

void *tracked_alloc(size_t size) {
    void *ptr = malloc(size);
    allocations[allocation_count++] = (Allocation){ptr, size};
    return ptr;
}
```

### Slow Performance

1. Profile with callgrind
2. Identify hot functions
3. Consider bytecode compilation instead of tree-walking
4. Cache frequently accessed values
