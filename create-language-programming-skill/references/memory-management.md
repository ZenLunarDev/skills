# Memory Management

Memory management strategies for programming language implementations.

## Manual Memory Management

### When to Use

- Systems programming languages (like C, Rust without GC)
- Performance-critical applications
- Embedded systems with limited resources
- When user wants explicit control

### Implementation Pattern

```c
// All functions that allocate must have a destroy function
typedef struct {
    char *name;
    Value value;
    bool is_initialized;
} Variable;

Variable *variable_create(const char *name, Value value) {
    Variable *var = malloc(sizeof(Variable));
    var->name = strdup(name);
    var->value = value;
    var->is_initialized = true;
    return var;
}

void variable_destroy(Variable *var) {
    if (!var) return;
    free(var->name);
    // Free Value if it contains heap data
    free(var);
}
```

### Ownership Rules

Document ownership clearly:

```c
// Function takes ownership of 'name'
void register_function(const char *name, Function *func);

// Function borrows 'name' (does not free)
void print_function_name(const char *name);
```

### Common Pitfalls

1. **Double free**: Never free memory twice. Set pointer to NULL after freeing.
2. **Use after free**: Do not access freed memory. Use valgrind to detect.
3. **Memory leak**: Every malloc must have a corresponding free.
4. **Dangling pointer**: Pointers to stack/local variables become invalid.

### Debug Helpers

```c
#ifdef DEBUG
#define malloc(size) debug_malloc(size, __FILE__, __LINE__)
#define free(ptr) debug_free(ptr, __FILE__, __LINE__)
#endif

void *debug_malloc(size_t size, const char *file, int line) {
    void *ptr = malloc(size);
    fprintf(stderr, "MALLOC %p (%zu bytes) at %s:%d\n", ptr, size, file, line);
    return ptr;
}

void debug_free(void *ptr, const char *file, int line) {
    fprintf(stderr, "FREE %p at %s:%d\n", ptr, file, line);
    free(ptr);
}
```

## Garbage Collection

### When to Use

- Scripting languages
- High-level application languages
- When simplicity is preferred over control

### Mark and Sweep

```c
typedef struct {
    bool is_marked;
    // Object data
} Obj;

void gc_mark(VM *vm) {
    for (int i = 0; i < vm->frame_count; i++) {
        mark_object((Obj *)vm->frames[i].closure);
    }
    for (Value *slot = vm->stack; slot < vm->sp; slot++) {
        mark_value(*slot);
    }
    mark_table(&vm->globals);
}

void gc_sweep(void) {
    Obj **object = &vm->objects;
    while (*object) {
        if (!(*object)->is_marked) {
            Obj *unreached = *object;
            *object = unreached->next;
            free_object(unreached);
        } else {
            (*object)->is_marked = false;
            object = &(*object)->next;
        }
    }
}

void gc_collect(VM *vm) {
    gc_mark(vm);
    gc_sweep();
}
```

### Generational GC

Objects that survive one GC are promoted to old generation. GC runs more frequently on young generation.

```c
typedef struct {
    Obj **young_objects;
    Obj **old_objects;
    size_t young_count;
    size_t old_count;
} Heap;

void gc_collect_young(Heap *heap) {
    // Mark only young objects and roots
    mark_roots();
    for (size_t i = 0; i < heap->young_count; i++) {
        if (heap->young_objects[i]->is_marked) {
            promote_to_old(heap, heap->young_objects[i]);
        }
    }
    sweep_young(heap);
}
```

## Reference Counting

### When to Use

- When deterministic destruction is needed
- When cyclic references are rare or avoidable
- Objective-C/Swift style

### Implementation

```c
typedef struct {
    size_t ref_count;
    // Object data
} RefCounted;

void refcount_increment(RefCounted *obj) {
    obj->ref_count++;
}

void refcount_decrement(RefCounted *obj) {
    obj->ref_count--;
    if (obj->ref_count == 0) {
        free_object(obj);
    }
}
```

### Cycle Detection

```c
// Weak references to break cycles
typedef struct {
    Obj *parent;  // Strong reference
    Obj *child;   // Strong reference
} Node;

// Break cycle before freeing
void node_destroy(Node *node) {
    if (node->parent) {
        // Remove child from parent's list
    }
    refcount_decrement(node->parent);
    refcount_decrement(node->child);
}
```

## Arena Allocation

### When to Use

- Temporary allocations during a phase (parsing, codegen)
- When all allocations can be freed at once
- Performance-critical temporary storage

### Implementation

```c
typedef struct {
    char *buffer;
    size_t size;
    size_t used;
    size_t count;
} Arena;

void arena_init(Arena *arena, size_t size) {
    arena->buffer = malloc(size);
    arena->size = size;
    arena->used = 0;
    arena->count = 0;
}

void *arena_alloc(Arena *arena, size_t size) {
    // Align to 8 bytes
    size_t aligned = (size + 7) & ~7;
    if (arena->used + aligned > arena->size) {
        return NULL; // Out of memory
    }
    void *ptr = arena->buffer + arena->used;
    arena->used += aligned;
    arena->count++;
    return ptr;
}

void arena_reset(Arena *arena) {
    arena->used = 0;
    arena->count = 0;
}

void arena_free(Arena *arena) {
    free(arena->buffer);
    arena->buffer = NULL;
    arena->size = 0;
    arena->used = 0;
    arena->count = 0;
}
```

### Usage in Parser

```c
Parser *parser_create(Lexer *lexer) {
    Parser *parser = malloc(sizeof(Parser));
    arena_init(&parser->arena, 1024 * 1024); // 1MB arena
    parser->lexer = lexer;
    return parser;
}

ASTNode *ast_node_create(ASTNodeType type) {
    ASTNode *node = arena_alloc(&parser->arena, sizeof(ASTNode));
    node->type = type;
    return node;
}

void parser_destroy(Parser *parser) {
    arena_free(&parser->arena);
    free(parser);
}
```

## Region-Based Memory

### When to Use

- When objects have similar lifetimes
- When you can define "regions" of allocation

### Implementation

```c
typedef struct Region {
    struct Region *parent;
    void **objects;
    size_t count;
    size_t capacity;
} Region;

void region_init(Region *region, Region *parent) {
    region->parent = parent;
    region->objects = NULL;
    region->count = 0;
    region->capacity = 0;
}

void *region_alloc(Region *region, size_t size) {
    if (region->count >= region->capacity) {
        region->capacity = region->capacity == 0 ? 8 : region->capacity * 2;
        region->objects = realloc(region->objects, region->capacity * sizeof(void *));
    }
    void *ptr = malloc(size);
    region->objects[region->count++] = ptr;
    return ptr;
}

void region_free(Region *region) {
    for (size_t i = 0; i < region->count; i++) {
        free(region->objects[i]);
    }
    free(region->objects);
    region->objects = NULL;
    region->count = 0;
    region->capacity = 0;
}
```

## Strategy Selection Guide

| Strategy | Deterministic Free | Handles Cycles | Performance | Complexity |
|----------|-------------------|----------------|-------------|------------|
| Manual | Yes | N/A | Fastest | High |
| Arena | Yes (bulk) | N/A | Fastest | Low |
| Region | Yes (bulk) | N/A | Fast | Medium |
| Reference Counting | Yes | No (manual break) | Medium | Medium |
| GC (Mark-Sweep) | No | Yes | Slow | Medium |
| GC (Generational) | No | Yes | Medium | High |

## Best Practices

1. **Document ownership**: Every function must document who owns returned pointers.
2. **Use RAII patterns**: Wrap resources in structs with init/destroy functions.
3. **Validate pointers**: Check for NULL before dereferencing.
4. **Use tools**: Run valgrind, address sanitizer, or similar tools regularly.
5. **Start simple**: Begin with manual management, add GC later if needed.
