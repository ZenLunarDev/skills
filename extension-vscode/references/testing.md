# Testing Strategies

## Unit Testing

Use Mocha with Sinon for unit testing. Test domain logic without VSCode dependencies.

## Setup

```typescript
// tests/unit/example.test.ts
import * as assert from 'assert';
import { describe, it, beforeEach, afterEach } from 'mocha';
import * as sinon from 'sinon';
import { DocumentProcessor } from '../../src/core/use-cases/document-processor';
import { Document } from '../../src/core/entities/document';

describe('DocumentProcessor', () => {
  let processor: DocumentProcessor;
  
  beforeEach(() => {
    processor = new DocumentProcessor();
  });
  
  afterEach(() => {
    sinon.restore();
  });
  
  it('should process document correctly', async () => {
    const document = new Document({
      text: '  Hello World  ',
      languageId: 'plaintext',
      version: 1,
      lineCount: 1,
    });
    
    const result = await processor.process(document);
    
    assert.strictEqual(result.processed, 'Hello World');
    assert.strictEqual(result.metadata.originalLength, 15);
    assert.strictEqual(result.metadata.processedLength, 11);
  });
  
  it('should handle empty documents', async () => {
    const document = new Document({
      text: '',
      languageId: 'plaintext',
      version: 1,
      lineCount: 0,
    });
    
    const result = await processor.process(document);
    
    assert.strictEqual(result.processed, '');
    assert.strictEqual(result.metadata.originalLength, 0);
  });
});
```

## Integration Testing

Test extension activation and command execution with VSCode API:

```typescript
// tests/integration/commands.test.ts
import * as vscode from 'vscode';
import * as assert from 'assert';
import { describe, it, before, after } from 'mocha';
import { activate, deactivate } from '../../src/extension';

describe('Extension Commands Integration', () => {
  let context: vscode.ExtensionContext;
  
  before(async () => {
    context = await activate({} as vscode.ExtensionContext);
  });
  
  after(async () => {
    await deactivate();
  });
  
  it('should execute sample command', async () => {
    const document = await vscode.workspace.openTextDocument({
      content: '  test content  ',
      language: 'plaintext',
    });
    
    await vscode.window.showTextDocument(document);
    
    await vscode.commands.executeCommand('your-extension.sampleCommand');
    
    const updatedDocument = vscode.window.activeTextEditor?.document;
    assert(updatedDocument);
    assert.strictEqual(updatedDocument.getText(), 'test content');
  });
});
```

## E2E Testing

Use VSCode extension test runner for end-to-end tests. Configure in `tests/runTest.js`.

## Guidelines

- Write unit tests for all domain logic
- Mock VSCode dependencies in unit tests
- Use integration tests for command execution
- Keep tests fast and isolated
- Aim for high code coverage
