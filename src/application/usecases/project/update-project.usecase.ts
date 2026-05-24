import { ProjectNotFoundError } from '@domain/common';
import { Inject, Injectable } from '@nestjs/common';
import {
  Project,
  PROJECT_REPOSITORY,
  ProjectRepository,
  UpdateProjectInput,
} from '@domain/project';
import { CacheInvalidationService } from '@infrastructure/cache';

@Injectable()
export class UpdateProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    private readonly cacheInvalidation: CacheInvalidationService,
  ) {}

  async execute(id: number, input: UpdateProjectInput): Promise<Project> {
    const exists = await this.projectRepository.exists(id);
    if (!exists) {
      throw new ProjectNotFoundError(id);
    }
    const project = await this.projectRepository.update(id, input);
    await this.cacheInvalidation.invalidateProject(id);
    return project;
  }
}
