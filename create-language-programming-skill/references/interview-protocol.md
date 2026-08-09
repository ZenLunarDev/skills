# Interview Protocol

Detailed protocol for asking clarifying questions and handling user responses during language design sessions.

## State Machine

```
START
  |
  v
[Assess Context] --> [Has Answers?] --No--> [Ask Batch 1] --> [Wait]
  |                                              |
 Yes                                             v
  |                                        [Receive Answers]
  |                                              |
  |                                        [Validate Answers]
  |                                              |
  |                                        [Complete?] --No--> [Ask Next Batch]
  |                                              |
  |                                        [Complete?] --Yes-->
  |                                              |
  v                                              v
[Load References] <-------------------------- [Summarize & Confirm]
  |
  v
[Design Syntax]
  |
  v
[Scaffold Project]
  |
  v
[Implement Phases]
  |
  v
[Validate & Deliver]
  |
  v
END
```

## Question Batches

### Batch 1: Foundation (Questions 1-4)

**When to ask**: At the start of the conversation, before any design work.

**Questions**:
1. **Language Name**: "What is the name of the language?"
   - Accept: single word, hyphenated, or descriptive name
   - Reject: names with spaces, special characters, or existing language names
   - Default if unclear: "MyLang"

2. **Paradigm**: "Which paradigm(s) should the language support? (Procedural, OOP, Functional, Multi-paradigm, Logic)"
   - If user says "I don't know": Ask "Do you need object-oriented features like classes and inheritance?"
   - If user says "modern": Interpret as multi-paradigm with functional influences
   - Record as: single value or comma-separated list

3. **Execution Model**: "Should the language be compiled or interpreted?"
   - If user says "fast": Compiled
   - If user says "scripting" or "dynamic": Interpreted
   - If user says "both": Ask which is primary, or recommend compiled with optional REPL
   - Record as: `compiled` or `interpreted`

4. **Target Use Case**: "What problem domain or use case does the language solve? (Systems, Scripting, Education, Data, Embedded)"
   - If user mentions multiple: Ask to pick primary
   - If user says "general purpose": Record as `general-purpose`
   - Record as: single value

### Batch 2: Syntax and Types (Questions 5-7)

**When to ask**: After Batch 1 is complete and confirmed.

**Questions**:
5. **Syntax Style**: "Should the syntax be C-like, Python-like, Lisp-like, or a unique custom style?"
   - If user says "modern" or "clean": Recommend C-like with Rust-inspired features
   - If user says "minimal": Recommend Lisp-like
   - If user says "readable": Recommend Python-like
   - Record as: `c-like`, `python-like`, `lisp-like`, or `custom`

6. **Typing System**: "Static, dynamic, gradual, or inferred typing?"
   - If user says "like JavaScript": Dynamic
   - If user says "like TypeScript": Gradual
   - If user says "like Go": Inferred static
   - If user says "like C": Explicit static
   - Record as: `static`, `dynamic`, `gradual`, or `inferred`

7. **Memory Management**: "Manual (malloc/free), garbage collection, region-based, or reference counting?"
   - If execution model is compiled and target is systems: Recommend manual
   - If execution model is interpreted: Recommend GC or reference counting
   - If user says "safe": Recommend GC or reference counting
   - Record as: `manual`, `gc`, `region`, or `refcount`

### Batch 3: Ecosystem (Questions 8-10)

**When to ask**: After Batch 2 is complete and confirmed.

**Questions**:
8. **Standard Library**: "What core features should the standard library include? (I/O, collections, math, networking, OS interface)"
   - If user says "minimal": Record as `io, math`
   - If user says "batteries included": Record as `io, collections, math, networking, os`
   - Allow multiple selections

9. **Error Handling**: "Exceptions, error codes, Result/Either types, or panic/catch?"
   - If user says "like C": Error codes
   - If user says "like Java/Python": Exceptions
   - If user says "like Rust": Result/Either types
   - If user says "simple": Panic/catch
   - Record as: `exceptions`, `error-codes`, `result-types`, or `panic-catch`

10. **Concurrency Model**: "Threads, async/await, coroutines, message passing, or single-threaded only?"
    - If target is embedded or scripting: Recommend single-threaded
    - If target is systems: Recommend threads
    - If user says "modern": Recommend async/await
    - Record as: `threads`, `async-await`, `coroutines`, `message-passing`, or `single-threaded`

## Validation Rules

### Incomplete Answers

| Question | Incomplete Answer | Follow-up Question |
|----------|------------------|-------------------|
| Paradigm | "I want a modern language" | "Should it support object-oriented features like classes?" |
| Execution Model | "I want it fast" | "Do you need a standalone binary or a script runtime?" |
| Syntax Style | "I want it clean" | "Do you prefer familiar C braces or Python indentation?" |
| Typing | "I want it safe" | "Do you want explicit type annotations or type inference?" |
| Memory | "I don't want to manage memory" | "Is garbage collection acceptable, or do you prefer reference counting?" |

### Contradictory Answers

| Combination | Problem | Resolution |
|-------------|---------|------------|
| Static + No type annotations | Impossible | Explain inference is needed, or require annotations |
| Manual memory + GC runtime | Contradiction | Clarify which layer manages memory |
| Single-threaded + Threads | Contradiction | Ask which is primary |
| Lisp syntax + C-like preferences | Contradiction | Ask to choose one or hybrid |

### Confirmation Summary

After all answers are collected, present this exact format:

```markdown
## Requirements Summary

**Language Name**: <name>
**Paradigm**: <paradigm>
**Execution Model**: <compiled/interpreted>
**Target Use Case**: <use case>
**Syntax Style**: <style>
**Typing System**: <typing>
**Memory Management**: <memory>
**Standard Library**: <stdlib>
**Error Handling**: <errors>
**Concurrency**: <concurrency>

Is this correct? (yes/no/edit)
```

Do not proceed until the user confirms.

## Reference Loading Decision Tree

```
After confirmation:
  |
  +-- Always load: references/syntax-design.md
  +-- Always load: references/compiler-architecture.md
  |
  +-- execution_model == "interpreted"?
  |     +-- Load: references/interpreter-design.md
  |     +-- Skip: references/compiler-design.md
  |
  +-- execution_model == "compiled"?
  |     +-- Load: references/compiler-design.md
  |     +-- Skip: references/interpreter-design.md
  |
  +-- syntax_style contains "c-like"?
  |     +-- Load: references/syntax-examples.md#c-like
  |
  +-- syntax_style contains "python-like"?
  |     +-- Load: references/syntax-examples.md#python-like
  |
  +-- syntax_style == "custom"?
  |     +-- Load: references/syntax-examples.md#custom
  |
  +-- typing == "dynamic"?
  |     +-- Note: Skip semantic analysis phase in compiler-architecture.md
  |
  +-- memory == "manual"?
  |     +-- Load: references/memory-management.md (if exists)
  |
  +-- error_handling == "panic-catch"?
  |     +-- Note: Implement simple unwinding in runtime
```

## Edge Case Responses

### User Wants to Skip Questions

Response: "I can skip directly to implementation if you provide the requirements. Alternatively, I can suggest defaults for each unanswered question. Which do you prefer?"

If user chooses defaults:
- Name: "MyLang"
- Paradigm: Multi-paradigm
- Execution: Compiled
- Use Case: General-purpose
- Syntax: C-like
- Typing: Static with inference
- Memory: Manual (with optional GC library)
- Standard Library: I/O, collections, math
- Errors: Result/Either types
- Concurrency: Threads

### User Changes Mind Mid-Implementation

1. Acknowledge the change
2. Assess impact on existing code
3. Offer to refactor or restart
4. Update requirements summary

### User Asks for Something Contradictory

Response format:
"I notice a potential conflict: you requested <feature A> but also <feature B>. These are typically incompatible because <reason>. Would you like me to:
1. Prioritize <feature A>
2. Prioritize <feature B>
3. Propose a compromise"

### User Provides No Feedback

If user does not respond to confirmation summary within reasonable time, send reminder:
"Please review the requirements summary above. Reply 'confirm' to proceed, or list changes needed."

## Output Protocols

### After Syntax Design

Present SYNTAX.md with this structure:
```markdown
# SYNTAX.md

## Grammar
<EBNF>

## Lexical Structure
<Tokens, comments, literals>

## Operator Precedence
<Table>

## Type System
<Primitives, composites, rules>

## Control Flow
<if, while, for, switch>

## Functions
<Declaration, parameters, returns>

## Modules
<Import/export system>
```

Ask: "Does this syntax look correct? I will proceed to implementation after confirmation."

### After Implementation

Present the structured summary defined in SKILL.md Step 10.

## Time Management

- Questions: 2-3 minutes per batch
- Syntax design: 5-10 minutes
- Scaffolding: 1 minute
- Lexer implementation: 5-10 minutes
- Parser implementation: 10-15 minutes
- AST implementation: 5 minutes
- Semantic analysis: 10-15 minutes
- Code generation: 10-20 minutes
- Standard library: 10-20 minutes
- Tests: 5-10 minutes
- Documentation: 5 minutes

Total estimated time: 1-2 hours for a minimal working language.
