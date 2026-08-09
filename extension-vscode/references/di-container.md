# Dependency Injection Container

## Inversify Setup

Use Inversify for dependency injection to enable testability and loose coupling.

## Implementation

```typescript
// src/shared/di/container.ts
import { Container, injectable, inject } from 'inversify';
import * as vscode from 'vscode';

const TYPES = {
  Command: Symbol('Command'),
  Provider: Symbol('Provider'),
  Service: Symbol('Service'),
  Repository: Symbol('Repository'),
};

@injectable()
export class ServiceLocator {
  private static container: Container | null = null;
  
  static initialize(): void {
    this.container = new Container({ defaultScope: 'Singleton' });
    this.registerServices();
  }
  
  private static registerServices(): void {
    // Register services
    this.container!.bind<vscode.ExtensionContext>(TYPES.ExtensionContext)
      .toDynamicValue(() => ExtensionContextManager.getInstance().context);
    
    // Register repositories
    this.container!.bind<ConfigurationRepository>(TYPES.Repository)
      .to(ConfigurationRepository);
    
    // Register services
    this.container!.bind<DocumentService>(TYPES.Service)
      .to(DocumentService);
  }
  
  static get<T>(serviceIdentifier: symbol): T {
    if (!this.container) {
      throw new Error('ServiceLocator not initialized');
    }
    return this.container.get<T>(serviceIdentifier);
  }
}
```

## Guidelines

- Initialize the container during extension activation
- Use singleton scope for most services
- Use transient scope for stateless utilities
- Define clear interfaces for all dependencies
- Avoid service locator anti-pattern; prefer constructor injection
