import { Inject, Injectable } from '@nestjs/common';
import {
  PROJECT_REPOSITORY,
  ProjectListItem,
  ProjectRepository,
} from '@domain/project';
import { CacheKeys, CacheService } from '@infrastructure/cache';

@Injectable()
export class GetProjectsUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    private readonly cacheService: CacheService,
  ) {}

  async execute(): Promise<ProjectListItem[]> {
    const key = CacheKeys.projectsList();
    const cached = await this.cacheService.get<ProjectListItem[]>(key);
    if (cached) {
      return cached;
    }

    const projects = await this.projectRepository.findAllWithCoverImage();
    await this.cacheService.set(
      key,
      projects,
      this.cacheService.ttl.projectsList,
    );
    return projects;
  }
}
