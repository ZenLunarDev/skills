# Error Handling

## Centralized Error Handling

Implement a centralized error handling system with severity levels and global handlers.

## Implementation

```typescript
// src/shared/errors/error-handler.ts
import * as vscode from 'vscode';
import { Logger } from '../logger/logger';

export enum ErrorSeverity {
  Fatal = 'FATAL',
  Error = 'ERROR',
  Warning = 'WARNING',
  Info = 'INFO',
}

export class ExtensionError extends Error {
  constructor(
    message: string,
    public readonly severity: ErrorSeverity = ErrorSeverity.Error,
    public readonly code?: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ExtensionError';
  }
}

export class ErrorHandler {
  private static logger = new Logger('ErrorHandler');
  private static isGlobalHandlerSet = false;
  
  static setupGlobalHandler(): void {
    if (this.isGlobalHandlerSet) return;
    
    process.on('uncaughtException', error => {
      this.handleFatal(error, 'Uncaught exception');
    });
    
    process.on('unhandledRejection', reason => {
      this.handleFatal(reason, 'Unhandled rejection');
    });
    
    this.isGlobalHandlerSet = true;
  }
  
  static handleFatal(error: unknown, context: string): void {
    this.logger.fatal(`${context}: ${this.getErrorMessage(error)}`, error);
    
    vscode.window.showErrorMessage(
      `Fatal error in extension. Please restart VSCode.`
    );
  }
  
  static handleError(error: unknown, context: string): void {
    this.logger.error(`${context}: ${this.getErrorMessage(error)}`, error);
    
    if (error instanceof ExtensionError) {
      vscode.window.showErrorMessage(`${error.message}`);
    }
  }
  
  static async handleAsync<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T | void> {
    try {
      return await operation();
    } catch (error) {
      this.handleError(error, context);
      throw error;
    }
  }
  
  private static getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Unknown error';
  }
  
  static cleanup(): void {
    this.logger.info('Cleaning up error handlers');
  }
}
```

## Guidelines

- Create custom error classes extending Error
- Use error codes for programmatic handling
- Set up global handlers for uncaught exceptions
- Log all errors with context
- Show user-friendly messages in VSCode UI
- Clean up handlers on deactivation
