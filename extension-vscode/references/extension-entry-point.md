# Extension Entry Point

## Thin Orchestrator Pattern

Keep `src/extension.ts` as a thin orchestrator that only handles activation and deactivation. All business logic should reside in separate modules.

## Implementation

```typescript
// src/extension.ts
import * as vscode from 'vscode';
import { CommandRegistry } from './infrastructure/commands/command-registry';
import { ExtensionContextManager } from './shared/context/extension-context-manager';
import { ErrorHandler } from './shared/errors/error-handler';
import { Logger } from './shared/logger/logger';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const logger = new Logger('Extension');
  
  try {
    logger.info('Activating extension...');
    
    // Initialize context manager
    const contextManager = ExtensionContextManager.initialize(context);
    
    // Register all commands
    const commandRegistry = new CommandRegistry(contextManager);
    await commandRegistry.registerAll();
    
    // Initialize providers
    await initializeProviders(contextManager);
    
    // Setup error handling
    ErrorHandler.setupGlobalHandler();
    
    logger.info('Extension activated successfully');
  } catch (error) {
    ErrorHandler.handleFatal(error, 'Failed to activate extension');
    throw error;
  }
}

export function deactivate(): void {
  Logger.cleanup();
  ErrorHandler.cleanup();
}

async function initializeProviders(context: ExtensionContextManager): Promise<void> {
  // Initialize language features, code lens, decorations, etc.
  // This is where you'd register providers like:
  // - CompletionItemProvider
  // - CodeLensProvider
  // - DefinitionProvider
  // - HoverProvider
  // - ReferenceProvider
}
```

## Guidelines

- Keep the entry point under 50 lines
- Delegate all logic to specialized modules
- Use try-catch for activation errors
- Dispose all resources in deactivate
- Never put business logic in the entry point
