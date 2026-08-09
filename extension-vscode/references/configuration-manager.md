# Configuration Management

## Implementation

```typescript
// src/infrastructure/configuration/configuration-manager.ts
import * as vscode from 'vscode';
import { EventEmitter } from 'events';

export interface ExtensionConfig {
  enabled: boolean;
  features: {
    autoFormat: boolean;
    codeLenses: boolean;
    diagnostics: boolean;
  };
  formatting: {
    style: 'standard' | 'prettier' | 'custom';
    maxLineLength: number;
    indentSize: number;
    useTabs: boolean;
  };
}

export class ConfigurationManager extends EventEmitter {
  private static instance: ConfigurationManager | null = null;
  private config: ExtensionConfig | null = null;
  
  private constructor() {
    super();
    this.loadConfiguration();
    this.setupWatchers();
  }
  
  static getInstance(): ConfigurationManager {
    if (!this.instance) {
      this.instance = new ConfigurationManager();
    }
    return this.instance;
  }
  
  private loadConfiguration(): void {
    const config = vscode.workspace.getConfiguration('your-extension');
    
    this.config = {
      enabled: config.get('enable', true),
      features: {
        autoFormat: config.get('features.autoFormat', true),
        codeLenses: config.get('features.codeLenses', true),
        diagnostics: config.get('features.diagnostics', true),
      },
      formatting: {
        style: config.get('formatting.style', 'standard'),
        maxLineLength: config.get('formatting.maxLineLength', 80),
        indentSize: config.get('formatting.indentSize', 2),
        useTabs: config.get('formatting.useTabs', false),
      },
    };
  }
  
  private setupWatchers(): void {
    vscode.workspace.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration('your-extension')) {
        const previousConfig = { ...this.config };
        this.loadConfiguration();
        this.emit('configChanged', { previous: previousConfig, current: this.config });
      }
    });
  }
  
  getConfig(): ExtensionConfig {
    if (!this.config) {
      this.loadConfiguration();
    }
    return this.config!;
  }
  
  get<T>(key: string, defaultValue: T): T {
    return vscode.workspace.getConfiguration('your-extension').get(key, defaultValue);
  }
  
  async update(key: string, value: unknown): Promise<void> {
    await vscode.workspace.getConfiguration('your-extension').update(
      key,
      value,
      vscode.ConfigurationTarget.Workspace
    );
  }
}
```

## Guidelines

- Use singleton pattern for configuration manager
- Watch for configuration changes and emit events
- Provide typed configuration interfaces
- Support both get and update operations
- Emit events when configuration changes
