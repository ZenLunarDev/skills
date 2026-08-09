# Command Pattern Implementation

## Professional Command Pattern

Implement commands using a base command class with centralized error handling and logging.

## Base Command

```typescript
// src/infrastructure/commands/base-command.ts
import * as vscode from 'vscode';
import { Logger } from '../../shared/logger/logger';

export interface ICommand {
  readonly commandId: string;
  execute(...args: unknown[]): Promise<void>;
}

export abstract class BaseCommand implements ICommand {
  abstract readonly commandId: string;
  protected readonly logger: Logger;
  
  constructor(loggerName: string) {
    this.logger = new Logger(loggerName);
  }
  
  abstract execute(...args: unknown[]): Promise<void>;
  
  protected async withErrorHandling<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T | void> {
    try {
      return await operation();
    } catch (error) {
      this.logger.error(`Error in ${context}`, error);
      await this.showErrorMessage(error);
      throw error;
    }
  }
  
  private async showErrorMessage(error: unknown): Promise<void> {
    const message = error instanceof Error ? error.message : 'An error occurred';
    await vscode.window.showErrorMessage(`Your Extension: ${message}`);
  }
}
```

## Concrete Command

```typescript
// src/infrastructure/commands/sample-command.ts
import * as vscode from 'vscode';
import { BaseCommand } from './base-command';
import { DocumentService } from '../../core/services/document-service';

export class SampleCommand extends BaseCommand {
  readonly commandId = 'your-extension.sampleCommand';
  
  constructor(
    private readonly documentService: DocumentService
  ) {
    super('SampleCommand');
  }
  
  async execute(...args: unknown[]): Promise<void> {
    await this.withErrorHandling(async () => {
      const editor = vscode.window.activeTextEditor;
      
      if (!editor) {
        await vscode.window.showInformationMessage('No active editor found');
        return;
      }
      
      const document = editor.document;
      const content = await this.documentService.processDocument(document);
      
      await editor.edit(editBuilder => {
        const fullRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(document.getText().length)
        );
        editBuilder.replace(fullRange, content);
      });
      
      this.logger.info('Command executed successfully');
    }, 'execute');
  }
}
```

## Command Registry

```typescript
// src/infrastructure/commands/command-registry.ts
import * as vscode from 'vscode';
import { BaseCommand } from './base-command';
import { SampleCommand } from './sample-command';
import { ExtensionContextManager } from '../../shared/context/extension-context-manager';
import { ServiceLocator } from '../../shared/di/container';

export class CommandRegistry {
  private readonly commands: BaseCommand[] = [];
  private readonly contextManager: ExtensionContextManager;
  
  constructor(contextManager: ExtensionContextManager) {
    this.contextManager = contextManager;
    this.initializeCommands();
  }
  
  private initializeCommands(): void {
    // Register commands with dependency injection
    const documentService = ServiceLocator.get<DocumentService>(TYPES.Service);
    
    this.commands.push(
      new SampleCommand(documentService),
      // Add more commands here
    );
  }
  
  async registerAll(): Promise<void> {
    const disposables = this.commands.map(command => {
      return vscode.commands.registerCommand(
        command.commandId,
        command.execute.bind(command)
      );
    });
    
    this.contextManager.registerDisposables(...disposables);
  }
}
```

## Guidelines

- Keep commands focused on a single responsibility
- Use dependency injection for services
- Wrap execution in error handling
- Log all command executions
- Dispose commands via context manager
