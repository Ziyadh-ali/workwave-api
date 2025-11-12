// src/frameworks/di/index.ts
import { RepositoryRegistry } from "./repository.registry";
import { ControllerRegistry } from "./controller.registry";
import { UseCaseRegistry } from "./useCase.registry";

export class DependencyInjection {
  static registerAll(): void {
    RepositoryRegistry.registerRepositories();
    UseCaseRegistry.registerUseCases();
    ControllerRegistry.registerControllers();
  }
}