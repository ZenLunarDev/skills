# Syntax Examples

Concrete syntax comparisons for common language design patterns.

## C-like Syntax

### Variables and Types
```c
int x = 42;
const char *name = "Alice";
float ratio = 3.14f;

// Declaration without initialization
int y;

// Multiple declarations
int a = 1, b = 2, c = 3;
```

### Control Flow
```c
if (x > 0) {
    printf("positive\n");
} else if (x < 0) {
    printf("negative\n");
} else {
    printf("zero\n");
}

for (int i = 0; i < 10; i++) {
    printf("%d\n", i);
}

while (x > 0) {
    x--;
}

switch (day) {
    case MON: printf("Monday\n"); break;
    case TUE: printf("Tuesday\n"); break;
    default: printf("Other\n");
}
```

### Functions
```c
int add(int a, int b) {
    return a + b;
}

// Function pointer
int (*callback)(int, int);

// Struct
struct Point {
    int x;
    int y;
};
```

## Python-like Syntax

### Variables and Types
```python
x = 42
name = "Alice"
ratio = 3.14

# Type annotations (optional)
x: int = 42
name: str = "Alice"

# Multiple assignment
a, b, c = 1, 2, 3
```

### Control Flow
```python
if x > 0:
    print("positive")
elif x < 0:
    print("negative")
else:
    print("zero")

for i in range(10):
    print(i)

while x > 0:
    x -= 1

match day:
    case Day.MON: print("Monday")
    case Day.TUE: print("Tuesday")
    case _: print("Other")
```

### Functions
```python
def add(a: int, b: int) -> int:
    return a + b

# Lambda
callback = lambda a, b: a + b

# Class
class Point:
    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y
```

## Rust-like Syntax

### Variables and Types
```rust
let x = 42;
const NAME: &str = "Alice";
let ratio: f64 = 3.14;

// Immutable by default
let y = 10;
y = 20; // ERROR: cannot assign twice to immutable variable

// Mutable
let mut z = 10;
z = 20; // OK
```

### Control Flow
```rust
if x > 0 {
    println!("positive");
} else if x < 0 {
    println!("negative");
} else {
    println!("zero");
}

for i in 0..10 {
    println!("{}", i);
}

while x > 0 {
    x -= 1;
}

match day {
    Day::Mon => println!("Monday"),
    Day::Tue => println!("Tuesday"),
    _ => println!("Other"),
}
```

### Functions
```rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}

// Closure
let callback = |a, b| a + b;

// Struct
struct Point {
    x: i32,
    y: i32,
}
```

## Go-like Syntax

### Variables and Types
```go
var x int = 42
name := "Alice"
var ratio float64 = 3.14

// Multiple declarations
var a, b, c = 1, 2, 3

// Type inference
x := 42
```

### Control Flow
```go
if x > 0 {
    fmt.Println("positive")
} else if x < 0 {
    fmt.Println("negative")
} else {
    fmt.Println("zero")
}

for i := 0; i < 10; i++ {
    fmt.Println(i)
}

for x > 0 {
    x--
}

switch day {
case Mon:
    fmt.Println("Monday")
case Tue:
    fmt.Println("Tuesday")
default:
    fmt.Println("Other")
}
```

### Functions
```go
func add(a int, b int) int {
    return a + b
}

// Multiple return values
func divmod(a int, b int) (int, int) {
    return a / b, a % b
}

// Struct
type Point struct {
    X int
    Y int
}
```

## Custom Syntax Patterns

### Expression-Oriented
```c
// Everything is an expression
let result = if x > 0 { x } else { -x };

let name = match status {
    Status::Active => "Running",
    Status::Inactive => "Stopped",
    Status::Error => "Failed",
};

let sum = for i in 0..10 { i };
```

### Pipeline Operator
```c
let result = input
    |> parse()
    |> validate()
    |> transform()
    |> save();

// Equivalent to:
// let temp1 = parse(input);
// let temp2 = validate(temp1);
// let temp3 = transform(temp2);
// save(temp3);
```

### Pattern Matching
```c
match value {
    Some(x) => process(x),
    None => default(),
    Ok(data) => handle(data),
    Err(e) => error(e),
    List(head, tail) => combine(head, tail),
}
```

## Comparison Table

| Feature | C | Python | Rust | Go |
|---------|---|--------|------|-----|
| Variable declaration | `int x = 42;` | `x = 42` | `let x = 42;` | `x := 42` |
| Constant | `const int X = 42;` | `X = 42` (convention) | `const X: i32 = 42;` | `const X = 42` |
| Function | `int f(int x) { }` | `def f(x):` | `fn f(x: i32) -> i32 { }` | `func f(x int) int { }` |
| Block | `{ ... }` | `: ...` | `{ ... }` | `{ ... }` |
| Statement terminator | `;` | newline | `;` | `;` (optional) |
| Type annotation | after name | after name (optional) | after name | not required |
| Null | `NULL` | `None` | `None` | `nil` |
| Error handling | return codes | exceptions | Result<T, E> | multiple returns |

## Anti-Patterns to Avoid

1. **Overloading punctuation**: Do not use `->`, `=>`, `>>`, `<<` for too many different purposes
2. **Invisible delimiters**: Avoid significant whitespace unless the paradigm is functional/Lisp-like
3. **Context-sensitive keywords**: `type` should not mean different things in different contexts
4. **Implicit globals**: Never create global variables without explicit `global` or `var` keyword
5. **Magic operators**: Avoid defining custom operators unless the paradigm strongly supports it

## Recommended Defaults

When the user has no strong preference:

1. **Syntax Style**: C-like with Rust-inspired type inference
2. **Statement terminator**: Semicolon (less error-prone than significant whitespace)
3. **Block delimiters**: Braces `{}` (most familiar to C programmers)
4. **Type system**: Static with type inference for locals
5. **Function syntax**: `func name(params) -> return_type { }`
6. **Variable declaration**: `let` for mutable, `const` for immutable
7. **Error handling**: Result/Either types with pattern matching
