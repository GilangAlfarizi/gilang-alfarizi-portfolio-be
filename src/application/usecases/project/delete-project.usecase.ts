import { ProjectNotFoundError } from '@domain/common';
import { Inject, Injectable } from '@nestjs/common';
import { PROJECT_REPOSITORY, ProjectRepository } from '@domain/project';
import { CacheInvalidationService } from '@infrastructure/cache';

@Injectable()
export class DeleteProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    private readonly cacheInvalidation: CacheInvalidationService,
  ) {}

  async execute(id: number): Promise<void> {
    const exists = await this.projectRepository.exists(id);
    if (!exists) {
      throw new ProjectNotFoundError(id);
    }
    await this.projectRepository.delete(id);
    await this.cacheInvalidation.invalidateProject(id);
  }
}
