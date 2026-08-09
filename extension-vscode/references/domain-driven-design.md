# Domain-Driven Design Implementation

## Architecture Layers

Separate domain logic from VSCode-specific infrastructure to enable testing and reuse.

## Domain Entities

```typescript
// src/core/entities/document.ts
export interface DocumentPosition {
  line: number;
  character: number;
}

export interface DocumentRange {
  start: DocumentPosition;
  end: DocumentPosition;
}

export interface DocumentContent {
  text: string;
  languageId: string;
  version: number;
  lineCount: number;
}

export class Document {
  private readonly content: DocumentContent;
  
  constructor(content: DocumentContent) {
    this.content = content;
  }
  
  getText(): string {
    return this.content.text;
  }
  
  getLanguageId(): string {
    return this.content.languageId;
  }
  
  getLineCount(): number {
    return this.content.lineCount;
  }
  
  getLineText(lineNumber: number): string {
    const lines = this.content.text.split('\n');
    return lines[lineNumber] || '';
  }
  
  getRange(start: DocumentPosition, end: DocumentPosition): string {
    // Implementation for range extraction
    return '';
  }
}
```

## Use Cases

```typescript
// src/core/use-cases/document-processor.ts
import { Document } from '../entities/document';

export interface DocumentProcessingResult {
  processed: string;
  metadata: {
    originalLength: number;
    processedLength: number;
    duration: number;
  };
}

export interface IDocumentProcessor {
  process(document: Document): Promise<DocumentProcessingResult>;
}

export class DocumentProcessor implements IDocumentProcessor {
  async process(document: Document): Promise<DocumentProcessingResult> {
    const startTime = Date.now();
    const originalText = document.getText();
    
    // Business logic here
    const processed = this.applyTransformations(originalText);
    
    return {
      processed,
      metadata: {
        originalLength: originalText.length,
        processedLength: processed.length,
        duration: Date.now() - startTime,
      },
    };
  }
  
  private applyTransformations(text: string): string {
    // Implement actual business logic
    return text.trim();
  }
}
```

## Infrastructure Adapters

Create VSCode-specific implementations that adapt VSCode APIs to domain interfaces:

```typescript
// src/infrastructure/adapters/vscode-document-adapter.ts
import * as vscode from 'vscode';
import { Document, DocumentContent } from '../../core/entities/document';

export class VSCodeDocumentAdapter {
  static fromVSCode(document: vscode.TextDocument): Document {
    const content: DocumentContent = {
      text: document.getText(),
      languageId: document.languageId,
      version: document.version,
      lineCount: document.lineCount,
    };
    
    return new Document(content);
  }
}
```

## Guidelines

- Keep domain entities pure and framework-agnostic
- Define interfaces for all use cases
- Use infrastructure adapters to bridge VSCode APIs to domain
- Never import VSCode modules in core domain
- Test domain logic without VSCode dependencies
