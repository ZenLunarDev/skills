# Syntax Design Principles

## Core Principles

### 1. Consistency
Apply uniform patterns across the language. If semicolons terminate statements, all statements must end with semicolons. If braces define blocks, all blocks use braces.

### 2. Orthogonality
Features should compose freely. Array types, function types, and pointer types should follow the same declaration rules. Avoid special cases.

### 3. Readability Over Writability
Prefer clarity at the call site. Explicit types at variable declarations are better than implicit types when the type is not obvious.

### 4. Minimal Surprise
Syntax should behave as expected. Operators with similar precedence in other languages should maintain similar precedence here.

### 5. Error Recovery
Design syntax so that common mistakes produce helpful error messages. Avoid ambiguous constructs that cannot be parsed uniquely.

## Naming Conventions

### Identifiers
- Use `snake_case` for variables and functions
- Use `PascalCase` for types and modules
- Reserve `ALL_CAPS` for constants and macros
- Avoid names that differ only in case

### Keywords
- Choose keywords that clearly indicate purpose
- Avoid abbreviations unless universally understood
- Reserve common words (e.g., `func`, `var`, `if`, `else`, `while`, `for`, `return`, `struct`, `enum`, `typedef`)

## Operator Design

### Arithmetic
- Use standard operators: `+`, `-`, `*`, `/`, `%`
- Provide clear integer division semantics
- Use `**` or `^` for exponentiation, but not both

### Comparison
- `==` equality, `!=` inequality
- `<`, `<=`, `>`, `>=` ordering
- Do not overload `==` for reference equality unless the paradigm demands it

### Logical
- `&&` short-circuit AND, `||` short-circuit OR
- `!` negation
- Avoid mixing logical and bitwise operators

### Assignment
- `=` assignment, `==` comparison
- Compound assignment: `+=`, `-=`, `*=`, `/=`, `%=` where applicable
- Destructuring assignment where the paradigm supports it

## Statement Design

### Control Flow
```ebnf
if_stmt     = "if", "(", expression, ")", block, { "else", "if", block }, [ "else", block ] ;
while_stmt  = "while", "(", expression, ")", block ;
for_stmt    = "for", "(", [ expression ], ";", [ expression ], ";", [ expression ], ")", block ;
return_stmt = "return", [ expression ], ";" ;
break_stmt  = "break", ";" ;
continue_stmt = "continue", ";" ;
```

### Function Declaration
```ebnf
func_decl = "func", identifier, "(", [ param_list ], ")", [ "->", type ], block ;
param_list = param, { ",", param } ;
param = identifier, [ ":", type ], [ "=", expression ] ;
```

### Variable Declaration
```ebnf
var_decl = "var", identifier, [ ":", type ], [ "=", expression ], ";" ;
const_decl = "const", identifier, [ ":", type ], "=", expression, ";" ;
```

## Expression Design

### Operator Precedence (highest to lowest)
1. Postfix: `()`, `[]`, `.`, `++`, `--`
2. Prefix: `-`, `!`, `~`, `++`, `--`, `*` (dereference), `&` (address)
3. Multiplicative: `*`, `/`, `%`
4. Additive: `+`, `-`
5. Shift: `<<`, `>>`
6. Relational: `<`, `<=`, `>`, `>=`
7. Equality: `==`, `!=`
8. Bitwise AND: `&`
9. Bitwise XOR: `^`
10. Bitwise OR: `|`
11. Logical AND: `&&`
12. Logical OR: `||`
13. Conditional: `? :`
14. Assignment: `=`, `+=`, `-=`, etc.

### Parenthesization
- Always allow parenthesized expressions
- Parentheses override precedence and improve readability

## Type System Design

### Primitive Types
- `bool` - Boolean
- `int` - Signed integer (platform-dependent width)
- `int8`, `int16`, `int32`, `int64` - Fixed-width integers
- `uint8`, `uint16`, `uint32`, `uint64` - Unsigned integers
- `float32`, `float64` - Floating point
- `char` - Character (UTF-8 or UTF-32, document choice)
- `string` - UTF-8 string (reference type)

### Composite Types
```ebnf
array_type  = type, "[", [ expression ], "]" ;
func_type   = "func", "(", [ type_list ], ")", [ "->", type ] ;
struct_type = "struct", "{", { field_decl }, "}" ;
enum_type   = "enum", identifier, "{", { enumerator }, "}" ;
pointer     = type, "*" ;
```

### Type Annotations
- Use `:` for type annotations in declarations
- Allow type inference for local variables when unambiguous
- Document inference rules clearly

## Common Anti-Patterns

1. **Ambiguous Grammars**: Do not allow the same token sequence to parse as multiple constructs
2. **Context-Sensitive Keywords**: Avoid keywords that change meaning based on context
3. **Implicit Conversions**: Avoid silent lossy conversions between numeric types
4. **Operator Overloading Abuse**: Restrict operator overloading to mathematically meaningful operations
5. **Magic Numbers**: Require named constants for repeated literal values
6. **Deep Nesting**: Provide syntax to reduce nesting depth (early return, pattern matching)

## Whitespace and Formatting

- Indentation: 4 spaces (no tabs)
- Max line length: 100 characters
- Braces: K&R style for C compatibility
- Spaces around operators: `a + b`, not `a+b`
- No spaces inside parentheses: `func(a, b)`, not `func( a, b )`
