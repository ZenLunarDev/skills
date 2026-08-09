---
name: extension-vscode
description: "This skill should be used when creating professional-grade VSCode extensions with TypeScript. Provides expert-level architecture patterns, clean code principles, SOLID design, domain-driven design, testing strategies, and production deployment workflows for VSCode extension development. Use when building scalable, maintainable extensions with professional project structure."
---

# VSCode Extension Development Mastery

## Purpose

Create professional-grade VSCode extensions using TypeScript with clean architecture, SOLID principles, and domain-driven design. This skill provides expert-level patterns for building scalable, maintainable extensions with comprehensive testing and production deployment workflows.

## When to Use

Use this skill when:
- Building new VSCode extensions from scratch
- Refactoring existing extensions to professional architecture
- Implementing complex extension features requiring domain-driven design
- Setting up professional testing and CI/CD pipelines for extensions
- Need guidance on VSCode extension APIs, patterns, and best practices

## Project Structure

Create the following professional project structure:

```
your-extension/
├── .vscode/
│   ├── extensions.json
│   ├── launch.json
│   └── settings.json
├── src/
│   ├── core/                 # Domain logic (framework-agnostic)
│   │   ├── entities/
│   │   ├── use-cases/
│   │   └── interfaces/
│   ├── infrastructure/       # VSCode-specific implementations
│   │   ├── commands/
│   │   ├── providers/
│   │   ├── decorations/
│   │   └── configuration/
│   ├── presentation/         # UI/UX layer
│   │   ├── webviews/
│   │   ├── status-bar/
│   │   └── quick-picks/
│   ├── shared/              # Cross-cutting concerns
│   │   ├── constants/
│   │   ├── types/
│   │   ├── utils/
│   │   └── errors/
│   └── extension.ts         # Entry point (thin orchestrator)
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── resources/
│   ├── icons/
│   └── themes/
├── .eslintrc.json
├── .prettierrc
├── tsconfig.json
├── package.json
├── webpack.config.js
└── README.md
```

## Initialization

To initialize a new VSCode extension project:

1. Install the generator globally:
   ```bash
   npm install -g yo generator-code
   ```

2. Run the generator:
   ```bash
   yo code
   ```
   Select TypeScript template and follow prompts.

3. Apply the professional configuration files from `references/` directory.

## TypeScript Configuration

Configure `tsconfig.json` with strict type checking:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

## Package Configuration

Configure `package.json` with professional settings:

```json
{
  "name": "your-extension",
  "displayName": "Your Extension Name",
  "description": "Professional VSCode extension",
  "version": "1.0.0",
  "engines": {
    "vscode": "^1.85.0"
  },
  "categories": ["Programming Languages", "Formatters", "Linters"],
  "keywords": ["productivity", "developer-tools"],
  "activationEvents": ["onStartupFinished"],
  "main": "./dist/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "your-extension.sampleCommand",
        "title": "Sample Command",
        "category": "Your Extension"
      }
    ],
    "keybindings": [
      {
        "command": "your-extension.sampleCommand",
        "key": "ctrl+shift+s",
        "mac": "cmd+shift+s"
      }
    ],
    "menus": {
      "command-palette": [
        {
          "command": "your-extension.sampleCommand"
        }
      ]
    },
    "configuration": {
      "title": "Your Extension",
      "properties": {
        "your-extension.enable": {
          "type": "boolean",
          "default": true,
          "description": "Enable/disable extension"
        }
      }
    }
  },
  "scripts": {
    "build": "webpack --mode production",
    "watch": "webpack --mode development --watch",
    "compile": "tsc -p ./",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts",
    "test": "npm run compile && node ./tests/runTest.js",
    "package": "vsce package",
    "publish": "vsce publish"
  },
  "devDependencies": {
    "@types/node": "^20.x",
    "@types/vscode": "^1.85.0",
    "@typescript-eslint/eslint-plugin": "^6.x",
    "@typescript-eslint/parser": "^6.x",
    "eslint": "^8.x",
    "prettier": "^3.x",
    "typescript": "^5.x",
    "webpack": "^5.x",
    "webpack-cli": "^5.x",
    "ts-loader": "^9.x",
    "vsce": "^2.x"
  }
}
```

## Core Architecture

### Extension Entry Point

Keep `src/extension.ts` as a thin orchestrator. Load the full implementation from `references/extension-entry-point.md`.

### Dependency Injection

Implement dependency injection using Inversify. Load the full container implementation from `references/di-container.md`.

### Command Pattern

Implement the command pattern with base command classes. Load the full command pattern implementation from `references/command-pattern.md`.

### Domain-Driven Design

Separate domain logic from VSCode-specific infrastructure:

- Place framework-agnostic business logic in `src/core/`
- Place VSCode-specific implementations in `src/infrastructure/`
- Use interfaces to define contracts between layers

Load the full DDD implementation examples from `references/domain-driven-design.md`.

### Error Handling

Implement centralized error handling with severity levels. Load the full error handling implementation from `references/error-handling.md`.

### Logging

Implement a professional logger with output channels and file logging. Load the full logger implementation from `references/logger.md`.

### Configuration Management

Implement centralized configuration with watchers. Load the full configuration manager implementation from `references/configuration-manager.md`.

## Testing

### Unit Testing

Use Mocha with Sinon for unit testing. Create tests in `tests/unit/`.

Load the full unit testing setup from `references/testing.md`.

### Integration Testing

Test extension activation and command execution. Create tests in `tests/integration/`.

### End-to-End Testing

Use VSCode extension test runner for E2E tests. Create tests in `tests/e2e/`.

## Build Configuration

Configure Webpack for production optimization. Load the full webpack configuration from `references/webpack-config.md`.

## Deployment

### Build Process

Execute the following commands in order:

```bash
npm install
npm run lint
npm run format
npm test
npm run build
vsce package
```

### CI/CD Pipeline

Set up GitHub Actions for automated building and publishing. Load the full CI/CD configuration from `references/ci-cd.md`.

### Marketplace Publishing

Publish to the VSCode Marketplace:

```bash
vsce publish
```

## Code Quality Standards

- Use 100% TypeScript strict mode
- Avoid `any` types; use `unknown` when type is uncertain
- Prefer `readonly` and `const` over mutable state
- Keep business logic pure and side-effect free
- Handle errors at appropriate levels with centralized error handler
- Use async/await; avoid blocking operations

## Development Workflow

- Use feature branches with git flow
- Follow semantic versioning
- Maintain CHANGELOG.md
- Enforce code review before merging
- Keep README and documentation updated

## Security Best Practices

- Sanitize all user inputs
- Never hardcode secrets
- Perform regular dependency security audits
- Request minimal required permissions in package.json
- Avoid eval() and dynamic code execution

## Progressive Disclosure

Load reference files from `references/` as needed during implementation:

- `references/extension-entry-point.md` - Thin orchestrator pattern
- `references/di-container.md` - Dependency injection setup
- `references/command-pattern.md` - Command pattern implementation
- `references/domain-driven-design.md` - DDD architecture examples
- `references/error-handling.md` - Centralized error handling
- `references/logger.md` - Professional logging implementation
- `references/configuration-manager.md` - Configuration management
- `references/testing.md` - Testing strategies and examples
- `references/webpack-config.md` - Production Webpack configuration
- `references/ci-cd.md` - CI/CD pipeline configuration
