import { Inject, Injectable } from '@nestjs/common';
import {
  CreateProjectInput,
  Project,
  PROJECT_REPOSITORY,
  ProjectRepository,
} from '@domain/project';
import { CacheInvalidationService } from '@infrastructure/cache';

@Injectable()
export class CreateProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    private readonly cacheInvalidation: CacheInvalidationService,
  ) {}

  async execute(input: CreateProjectInput): Promise<Project> {
    const project = await this.projectRepository.create(input);
    await this.cacheInvalidation.invalidateProjectsList();
    return project;
  }
}
