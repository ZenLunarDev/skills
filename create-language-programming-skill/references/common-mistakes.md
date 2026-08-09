# Common Mistakes

Common pitfalls in language design and implementation with solutions.

## Design Phase Mistakes

### 1. Ambiguous Grammar

**Problem**: The same token sequence can be parsed as multiple constructs.

**Example**:
```ebnf
// Ambiguous: is `foo(bar)` a function call or a parenthesized expression?
expr = identifier | identifier "(" [ expr ] ")" ;
```

**Solution**: Restructure grammar to eliminate ambiguity.
```ebnf
// Clear: function call is a distinct production
primary = identifier | number | string | "(" expression ")" ;
call = primary "(" [ argument_list ] ")" ;
```

### 2. Too Many Keywords

**Problem**: Using common words as keywords makes the language unusable for variable names.

**Example**: Using `type`, `class`, `object`, `string` as keywords.

**Solution**: Reserve a small set of keywords. Use context or sigils (prefixes/suffixes) for other constructs.

### 3. Inconsistent Precedence

**Problem**: Operators that look similar have different precedence.

**Example**: `&` as bitwise AND vs. address-of operator having different precedence.

**Solution**: Follow established precedence from C/JavaScript/Rust. Document any deviations clearly.

### 4. Silent Implicit Conversions

**Problem**: `int + float` silently converts without warning.

**Solution**: Require explicit casts. Report implicit narrowing conversions as warnings.

### 5. Overloading `==` for Identity

**Problem**: `==` checks reference equality instead of value equality.

**Solution**: Use `==` for value equality, `===` or `is` for reference equality.

## Implementation Phase Mistakes

### 1. Memory Leaks in AST

**Problem**: AST nodes allocated during parsing are never freed.

**Solution**: Implement `ast_node_destroy()` and call it at the end of compilation. Use arena allocation for temporary nodes.

### 2. Lexer State Not Reset

**Problem**: Reusing a lexer without resetting its state causes incorrect tokenization.

**Solution**: Provide `lexer_reset(Lexer *lexer, const char *source)` or create a new lexer instance.

### 3. Parser Panics on Invalid Input

**Problem**: Parser crashes or enters infinite loop on malformed input.

**Solution**: Implement error recovery. Synchronize to a safe point (semicolon, closing brace) and continue.

### 4. Type System Too Complex

**Problem**: Implementing full Hindley-Milner type inference is too complex for a new language.

**Solution**: Start with simple nominal typing. Add type inference later if needed.

### 5. Code Generator Generates Invalid C

**Problem**: Emitted C code has syntax errors or undefined behavior.

**Solution**: Write a simple C code validator or use a C compiler to check emitted output.

### 6. Ignoring Source Locations

**Problem**: Error messages say "Error" without line/column information.

**Solution**: Track line and column in every token and AST node. Include them in all error messages.

## Testing Phase Mistakes

### 1. Only Happy Path Tests

**Problem**: Tests only cover valid input, not error cases.

**Solution**: Write negative tests for every error condition: syntax errors, type errors, undefined variables, etc.

### 2. No Integration Tests

**Problem**: Unit tests pass but end-to-end compilation fails.

**Solution**: Add integration tests that compile complete programs and verify output.

### 3. Hardcoded Test Data

**Problem**: Tests use large inline strings that are hard to maintain.

**Solution**: Store test programs in separate files under `tests/fixtures/`.

## Build System Mistakes

### 1. Missing Clean Target

**Problem**: `make clean` does not remove all generated files.

**Solution**: List all generated files/directories in the clean target. Test it regularly.

### 2. No Debug Build

**Problem**: Only release builds are available, making debugging impossible.

**Solution**: Provide `debug` target with `-g -O0 -DDEBUG` flags.

### 3. Hardcoded Paths

**Problem**: Makefile uses absolute paths or assumes specific directory structure.

**Solution**: Use relative paths and variables. Make the build relocatable.

## Runtime Mistakes

### 1. Buffer Overflows in String Handling

**Problem**: Using `strcpy`, `strcat`, `sprintf` without bounds checking.

**Solution**: Use `strncpy`, `snprintf`, or implement safe string wrappers.

### 2. Integer Overflow

**Problem**: Arithmetic operations overflow silently.

**Solution**: Check for overflow in arithmetic operations or use checked integer types.

### 3. Use After Free

**Problem**: Accessing memory after it has been freed.

**Solution**: Use valgrind or address sanitizer during development. Set pointers to NULL after freeing.

### 4. Uninitialized Variables

**Problem**: Reading variables before assigning values.

**Solution**: Initialize all variables at declaration. Use `-Wuninitialized` flag.

## Documentation Mistakes

### 1. Grammar Not Documented

**Problem**: Users cannot know what syntax is valid.

**Solution**: Maintain `docs/GRAMMAR.md` with formal grammar specification.

### 2. No Examples

**Problem**: Documentation explains features but shows no code.

**Solution**: Include at least one example for every major feature.

### 3. Outdated README

**Problem**: README says one thing but the code does another.

**Solution**: Update README whenever behavior changes. Include build/run instructions that are tested.

## Recovery Strategies

### When Grammar is Ambiguous

1. Write down the ambiguous constructs
2. Create a decision table: for each input, which rule applies?
3. Add lookahead tokens to disambiguate
4. If still ambiguous, redesign the syntax

### When Type System is Broken

1. Write down all type rules in plain English
2. Create a type checking test matrix
3. Simplify: remove features until the core works
4. Add features back one by one

### When Code Generator is Wrong

1. Add debug output to show emitted code
2. Compare emitted code with expected output manually
3. Simplify: generate C code first, compile with real C compiler
4. Only switch to lower-level targets when C emission is stable

### When Performance is Bad

1. Profile before optimizing
2. Identify hotspots (usually parsing or memory allocation)
3. Optimize data structures (e.g., use string interning for identifiers)
4. Consider caching or precomputing

## Checklist Before Release

- [ ] All source files compile without warnings
- [ ] All tests pass
- [ ] No memory leaks (valgrind clean)
- [ ] Error messages include line/column
- [ ] Grammar is documented
- [ ] README is accurate
- [ ] Examples run successfully
- [ ] Build system works on clean checkout
- [ ] License is included
- [ ] Version number is set
