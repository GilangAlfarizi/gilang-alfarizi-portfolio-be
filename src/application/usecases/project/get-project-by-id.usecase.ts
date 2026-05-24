import { ProjectNotFoundError } from '@domain/common';
import { Inject, Injectable } from '@nestjs/common';
import { Project, PROJECT_REPOSITORY, ProjectRepository } from '@domain/project';
import { CacheKeys, CacheService } from '@infrastructure/cache';

@Injectable()
export class GetProjectByIdUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    private readonly cacheService: CacheService,
  ) {}

  async execute(id: number): Promise<Project> {
    const key = CacheKeys.project(id);
    const cached = await this.cacheService.get<Project>(key);
    if (cached) {
      return cached;
    }

    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new ProjectNotFoundError(id);
    }

    await this.cacheService.set(
      key,
      project,
      this.cacheService.ttl.projectDetail,
    );
    return project;
  }
}
