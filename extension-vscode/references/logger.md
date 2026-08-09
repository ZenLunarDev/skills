# Professional Logger

## Implementation

```typescript
// src/shared/logger/logger.ts
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  data?: Record<string, unknown>;
}

export class Logger {
  private static outputChannel: vscode.OutputChannel | null = null;
  private static logFile: string | null = null;
  private static minLevel: LogLevel = LogLevel.DEBUG;
  
  constructor(private readonly module: string) {
    this.initialize();
  }
  
  private initialize(): void {
    if (!Logger.outputChannel) {
      Logger.outputChannel = vscode.window.createOutputChannel('Your Extension');
      
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (workspaceFolder) {
        const logDir = path.join(workspaceFolder.uri.fsPath, '.vscode', 'logs');
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }
        Logger.logFile = path.join(logDir, 'extension.log');
      }
    }
  }
  
  static setMinLevel(level: LogLevel): void {
    Logger.minLevel = level;
  }
  
  private log(level: LogLevel, message: string, data?: Record<string, unknown>): void {
    if (level < Logger.minLevel) return;
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module: this.module,
      message,
      data,
    };
    
    const formatted = this.formatLogEntry(entry);
    Logger.outputChannel?.appendLine(formatted);
    
    if (Logger.logFile) {
      fs.appendFileSync(Logger.logFile, formatted + '\n');
    }
  }
  
  private formatLogEntry(entry: LogEntry): string {
    const levelStr = LogLevel[entry.level];
    const dataStr = entry.data ? ` ${JSON.stringify(entry.data)}` : '';
    return `[${entry.timestamp}] [${levelStr}] [${entry.module}] ${entry.message}${dataStr}`;
  }
  
  debug(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, data);
  }
  
  info(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, data);
  }
  
  warn(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, data);
  }
  
  error(message: string, error?: unknown): void {
    const data = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name,
    } : { error };
    
    this.log(LogLevel.ERROR, message, data);
  }
  
  fatal(message: string, error?: unknown): void {
    const data = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name,
    } : { error };
    
    this.log(LogLevel.FATAL, message, data);
  }
  
  static cleanup(): void {
    Logger.outputChannel?.dispose();
    Logger.outputChannel = null;
  }
}
```

## Guidelines

- Create logger instances per module
- Log to VSCode output channel and file simultaneously
- Use structured logging with timestamps and levels
- Support configurable log levels
- Clean up output channel on deactivation
