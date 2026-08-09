---
name: create-language-programming-skill
description: Guide for designing and implementing a new programming language in C with excellent syntax design, professional project structure, and clean architecture. Use when users want to create a new programming language, design language syntax, build a compiler or interpreter in C, or create a lexer, parser, and AST system. Includes clarifying questions to align understanding, syntax design principles, and implementation workflows.
metadata:
  category: development
  source:
    repository: 'https://github.com/ComposioHQ/awesome-claude-skills'
    path: skill-creator
    license_path: skill-creator/LICENSE.txt
    commit: 92568c1edaff1bde5371154f036d959346c145a8
---

# Create Language Programming Skill

Guide for designing and implementing a new programming language in C with professional architecture, excellent syntax design, and clean implementation structure.

## Trigger Detection

Activate this skill when the user input matches ANY of the following patterns (case-insensitive, regex allowed):

- "create a new programming language"
- "build a language"
- "design a programming language"
- "create a compiler"
- "build an interpreter"
- "make a scripting language"
- "design language syntax"
- "implement a lexer and parser"
- "create a PL" (PL = programming language)
- "new language for ..."
- "language that can ..."
- "DSL for ..." (Domain Specific Language)

Activate when user mentions "language" combined with any of:
C, compiler, interpreter, lexer, parser, syntax, grammar, PL

Do NOT activate for:
- "fix bug in language" (use debugging skill)
- "optimize compiler" (use performance skill)
- "learn C programming" (use learning resource)

## Agent State Machine

Execute these states in order. State transitions are strict unless user explicitly requests skip.

```
STATE: IDLE
  |
  | TRIGGER detected
  v
STATE: GATHER_REQUIREMENTS
  |
  | All 10 answers collected and confirmed
  v
STATE: LOAD_REFERENCES
  |
  | References loaded
  v
STATE: DESIGN_SYNTAX
  |
  | SYNTAX.md created and confirmed
  v
STATE: SCAFFOLD_PROJECT
  |
  | Project scaffolded
  v
STATE: IMPLEMENT_LEXER
  |
  | Lexer tests pass
  v
STATE: IMPLEMENT_PARSER
  |
  | Parser tests pass
  v
STATE: IMPLEMENT_AST
  |
  | AST tests pass
  v
STATE: IMPLEMENT_SEMANTIC
  |
  | Semantic tests pass
  v
STATE: IMPLEMENT_CODEGEN_OR_VM
  |
  | Integration tests pass
  v
STATE: IMPLEMENT_STDLIB
  |
  | Stdlib tests pass
  v
STATE: VALIDATE
  |
  | All checks pass
  v
STATE: DELIVER
  |
  | Summary presented
  v
STATE: IDLE
```

## State Definitions

### STATE: GATHER_REQUIREMENTS

**Objective**: Collect 10 answers from user in batches of 3-4.

**Actions**:
1. Check if answers already exist in conversation context.
2. If YES, skip to LOAD_REFERENCES.
3. If NO, proceed with questioning.

**Question Protocol**: Load `references/interview-protocol.md` for detailed questioning strategy.

**Batch 1** (Questions 1-4):
1. Language Name
2. Paradigm
3. Execution Model
4. Target Use Case

**Batch 2** (Questions 5-7):
5. Syntax Style
6. Typing System
7. Memory Management

**Batch 3** (Questions 8-10):
8. Standard Library
9. Error Handling
10. Concurrency Model

**Output**: requirements table confirmed by user.

**Transition**: To LOAD_REFERENCES when user confirms requirements.

**Error Handling**:
- Incomplete answer: Ask follow-up per interview-protocol.md
- Contradictory answer: Present contradiction and ask for priority
- No response: Send reminder with default options

### STATE: LOAD_REFERENCES

**Objective**: Load reference files needed for upcoming work.

**Decision Tree**:
```
ALWAYS load:
  - references/syntax-design.md
  - references/compiler-architecture.md

IF execution_model == "interpreted":
  LOAD: references/interpreter-design.md

IF execution_model == "compiled":
  LOAD: references/compiler-design.md

IF syntax_style == "c-like":
  READ: references/syntax-examples.md section C-like

IF syntax_style == "python-like":
  READ: references/syntax-examples.md section Python-like

IF syntax_style == "custom":
  READ: references/syntax-examples.md section Custom

IF typing == "dynamic":
  NOTE: Skip semantic analysis phase in compiler-architecture.md

IF memory == "manual":
  READ: references/memory-management.md (if exists)

IF error_handling == "panic-catch":
  NOTE: Implement simple unwinding in runtime
```

**Output**: References loaded into context.

**Transition**: To DESIGN_SYNTAX.

### STATE: DESIGN_SYNTAX

**Objective**: Create formal syntax specification.

**Actions**:
1. Based on requirements, design syntax using principles from references/syntax-design.md.
2. Create file `SYNTAX.md` in project root.
3. Present SYNTAX.md to user for confirmation.

**SYNTAX.md Structure** (mandatory):
```markdown
# SYNTAX.md

## Grammar
<EBNF or ABNF specification>

## Lexical Structure
<Tokens, comments, literals, whitespace rules>

## Operator Precedence
<Table from highest to lowest precedence>

## Type System
<Primitives, composites, type rules, inference>

## Control Flow
<if, while, for, switch, match, etc.>

## Functions
<Declaration syntax, parameters, return types, closures>

## Modules
<Import/export system, visibility rules>
```

**Output**: SYNTAX.md file created.

**Transition**: To SCAFFOLD_PROJECT after user confirms syntax.

### STATE: SCAFFOLD_PROJECT

**Objective**: Create project directory structure.

**Actions**:
1. Run `scripts/init_language.py <language-name> --path <output-directory>`.
2. If script fails, manually create directories:
   - src/
   - include/
   - lib/std/
   - tests/unit/
   - tests/integration/
   - examples/
   - docs/
3. Copy assets/Makefile.template to project root as Makefile.
4. Verify structure matches Project Structure section below.

**Output**: Project scaffolded at output-directory/language-name/.

**Transition**: To IMPLEMENT_LEXER.

### STATE: IMPLEMENT_LEXER

**Objective**: Implement tokenizer.

**Actions**:
1. Write `include/lexer.h` with TokenType enum and Lexer struct.
2. Write `src/lexer.c` with tokenization logic.
3. Write `tests/unit/test_lexer.c` with test cases.
4. Run `make test` and verify lexer tests pass.

**Test Requirements** (minimum):
- Single-character tokens
- Multi-character operators (==, !=, <=, >=)
- Identifiers and keywords
- Integer and float literals
- String literals with escaping
- Single-line and multi-line comments
- Whitespace handling
- Error recovery on invalid input

**Output**: Lexer implementation complete and tested.

**Transition**: To IMPLEMENT_PARSER when tests pass.

### STATE: IMPLEMENT_PARSER

**Objective**: Implement recursive descent parser.

**Actions**:
1. Write `include/parser.h` with Parser struct and function signatures.
2. Write `src/parser.c` with parsing logic using recursive descent.
3. For expressions, implement precedence climbing.
4. Write `tests/unit/test_parser.c`.
5. Run `make test` and verify parser tests pass.

**Implementation Order**:
1. Primary expressions (literals, identifiers, parenthesized)
2. Unary expressions
3. Binary expressions (multiplicative, additive, relational, equality, logical)
4. Assignment
5. Statements (expression, declaration, return)
6. Control flow (if, while, for)
7. Functions and blocks

**Output**: Parser implementation complete and tested.

**Transition**: To IMPLEMENT_AST when tests pass.

### STATE: IMPLEMENT_AST

**Objective**: Define AST node types and memory management.

**Actions**:
1. Define ASTNodeType enum in `include/parser.h` or `include/ast.h`.
2. Define ASTNode struct with tagged union.
3. Implement `ast_node_create()` and `ast_node_destroy()`.
4. Implement `ast_print()` for debugging.
5. Write `tests/unit/test_ast.c`.
6. Run `make test` and verify AST tests pass.

**Memory Management Rules**:
- Every heap-allocated node must be freed by ast_node_destroy.
- Use strdup() for strings stored in AST nodes.
- Free all child nodes recursively in destroy function.

**Output**: AST implementation complete and tested.

**Transition**: To IMPLEMENT_SEMANTIC when tests pass.

### STATE: IMPLEMENT_SEMANTIC

**Objective**: Implement semantic analysis (skip if typing is dynamic).

**Actions**:
1. Write `include/semantic.h` with symbol table and error list types.
2. Write `src/semantic.c` with symbol resolution and type checking.
3. Implement scope management (enter/exit scope).
4. Write `tests/unit/test_semantic.c`.
5. Run `make test` and verify semantic tests pass.

**Validation Steps**:
1. Resolve all identifiers to declarations
2. Check function calls against signatures
3. Verify assignment type compatibility
4. Check control flow reachability
5. Validate return statements

**Output**: Semantic analysis complete and tested.

**Transition**: To IMPLEMENT_CODEGEN_OR_VM when tests pass.

### STATE: IMPLEMENT_CODEGEN_OR_VM

**Decision**: Based on execution model from requirements.

#### If Compiled:

**Objective**: Emit C code or assembly.

**Actions**:
1. Write `include/codegen.h`.
2. Write `src/codegen.c` with code generation functions.
3. For each AST node type, implement emit function.
4. Emit C code that includes runtime.h.
5. Compile emitted C with system C compiler.
6. Write `tests/integration/test_compile.c`.
7. Run `make test` and verify integration tests pass.

#### If Interpreted:

**Objective**: Implement bytecode VM or tree-walker.

**Actions**:
1. Write `include/vm.h`.
2. Write `src/vm.c` with bytecode execution loop.
3. Define opcodes for all operations.
4. Implement value stack and call frames.
5. Write `tests/integration/test_vm.c`.
6. Run `make test` and verify integration tests pass.

**Output**: Code generator or VM complete and tested.

**Transition**: To IMPLEMENT_STDLIB when tests pass.

### STATE: IMPLEMENT_STDLIB

**Objective**: Implement standard library based on requirements.

**Actions**:
1. Create `lib/std/` directory.
2. Implement I/O functions (print, read, file operations).
3. Implement collection types (array, map, string) if requested.
4. Implement math functions if requested.
5. Implement OS interface if requested.
6. Write `docs/STDLIB.md`.
7. Run `make test` and verify stdlib tests pass.

**Output**: Standard library complete and documented.

**Transition**: To VALIDATE.

### STATE: VALIDATE

**Objective**: Verify implementation meets all quality standards.

**Checklist**:
1. All source files compile with `gcc -Wall -Wextra -Werror -std=c11`.
2. All unit tests pass.
3. All integration tests pass.
4. `make debug` works.
5. `make release` works.
6. `make test` works.
7. `make clean` removes all build artifacts.
8. Example program compiles and runs.
9. No memory leaks (run with valgrind if available).
10. Error messages include file:line:column format.

**Actions**:
1. Run `make clean && make debug`.
2. Run `make test`.
3. Compile and run `examples/hello.lang`.
4. If valgrind available: `valgrind --leak-check=full bin/language examples/hello.lang`.

**Output**: Validation report.

**Transition**: To DELIVER if all checks pass. If failures, return to relevant implementation state.

### STATE: DELIVER

**Objective**: Present final result to user.

**Mandatory Output Format**:
```markdown
## Language Implementation Summary

**Language Name**: <name>
**Paradigm**: <paradigm>
**Execution Model**: <compiled/interpreted>
**Target Use Case**: <use case>

### Project Structure
<tree view of created files>

### Key Features Implemented
- Lexer: <token types, special features>
- Parser: <grammar coverage, error recovery>
- Semantic Analysis: <type checking, scope rules>
- Code Generation: <target, optimizations>
- Standard Library: <modules implemented>

### How to Build
```bash
make debug
make release
make test
```

### Example Usage
```lang
<example program>
```

### Next Steps
- <recommendation 1>
- <recommendation 2>
- <recommendation 3>
```

**Transition**: To IDLE.

## Project Structure

Use this exact directory layout for all language projects:

```
language-name/
├── src/
│   ├── lexer.c
│   ├── lexer.h
│   ├── parser.c
│   ├── parser.h
│   ├── ast.c
│   ├── ast.h
│   ├── semantic.c
│   ├── semantic.h
│   ├── codegen.c           (compiled languages)
│   ├── codegen.h
│   ├── vm.c                (interpreted languages)
│   ├── vm.h
│   ├── main.c
│   └── utils.c
│   └── utils.h
├── include/
│   └── language.h
├── lib/
│   └── std/
│       ├── io.c
│       ├── collections.c
│       └── math.c
├── tests/
│   ├── unit/
│   │   ├── test_lexer.c
│   │   ├── test_parser.c
│   │   ├── test_ast.c
│   │   ├── test_semantic.c
│   │   └── test_codegen.c
│   └── integration/
│       └── test_compile.c
├── examples/
│   └── hello.lang
├── docs/
│   ├── GRAMMAR.md
│   ├── STDLIB.md
│   └── INTERNALS.md
├── SYNTAX.md
├── Makefile
├── README.md
└── LICENSE
```

## Implementation Workflow

To implement the language, proceed in this order:

1. Define the syntax: Document grammar in formal notation
2. Implement the lexer: Token definitions and scanning
3. Implement the parser: AST construction
4. Implement the AST: Node types and memory management
5. Implement semantic analysis: Symbol resolution and type checking
6. Implement code generation or interpretation
7. Implement standard library
8. Write tests
9. Write documentation
10. Optimize

## Edge Case Handling

### User Changes Requirements Mid-Implementation

1. Acknowledge change
2. Assess impact on existing code
3. Offer to refactor or restart
4. Update requirements summary

### User Requests Partial Implementation

If user says "just the lexer" or "only syntax design":
1. Implement only requested state
2. Document what is missing in a TODO.md file
3. Present partial result with clear boundaries

### User Provides Existing Project

If user mentions existing files or repository:
1. Skip SCAFFOLD_PROJECT state
2. Read existing files to understand structure
3. Ask which files need modification
4. Proceed from relevant state

### User Requests Unusual Feature

If user requests feature not covered by references:
1. Check if feature can be mapped to known pattern
2. If yes, implement using closest pattern
3. If no, inform user that custom implementation is needed
4. Document deviation in INTERNALS.md

## Output Requirements

### Code Quality

All generated code must:
- Compile with `gcc -Wall -Wextra -Werror -std=c11` without errors
- Include proper error handling (check return values, handle NULL)
- Use memory management correctly (free what you malloc)
- Follow naming: `snake_case` for functions/variables, `PascalCase` for types
- Include comments for non-obvious logic

### Documentation Quality

All generated documentation must:
- Be written in Markdown
- Include code examples for every feature
- Be clear enough for a junior developer
- Use proper grammar and spelling

### Test Quality

All generated tests must:
- Cover happy path and error cases
- Use descriptive test names
- Include assertions with clear failure messages
- Be organized by component (unit) and end-to-end (integration)

## Reference Files

- `references/syntax-design.md`: Detailed syntax design principles and anti-patterns. Load during DESIGN_SYNTAX.
- `references/compiler-architecture.md`: Phase specifications and data structures. Load during IMPLEMENT_LEXER through IMPLEMENT_CODEGEN_OR_VM.
- `references/syntax-examples.md`: Concrete syntax for C-like, Python-like, Rust-like, Go-like, and custom designs. Load during DESIGN_SYNTAX.
- `references/common-mistakes.md`: Pitfalls and solutions. Load when implementation struggles occur.
- `references/interview-protocol.md`: Detailed questioning protocol. Load during GATHER_REQUIREMENTS.
- `assets/Makefile.template`: Professional Makefile. Copy during SCAFFOLD_PROJECT.
- `assets/project-structure/`: Template files for each phase. Copy during SCAFFOLD_PROJECT.
- `scripts/init_language.py`: Scaffold script. Run during SCAFFOLD_PROJECT.
