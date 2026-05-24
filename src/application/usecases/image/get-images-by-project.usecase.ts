import { ProjectNotFoundError } from '@domain/common';
import { Image, IMAGE_REPOSITORY, ImageRepository } from '@domain/image';
import { PROJECT_REPOSITORY, ProjectRepository } from '@domain/project';
import { CacheKeys, CacheService } from '@infrastructure/cache';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetImagesByProjectUseCase {
  constructor(
    @Inject(IMAGE_REPOSITORY)
    private readonly imageRepository: ImageRepository,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    private readonly cacheService: CacheService,
  ) {}

  async execute(projectId: number): Promise<Image[]> {
    const key = CacheKeys.projectImages(projectId);
    const cached = await this.cacheService.get<Image[]>(key);
    if (cached) {
      return cached;
    }

    const exists = await this.projectRepository.exists(projectId);
    if (!exists) {
      throw new ProjectNotFoundError(projectId);
    }

    const images = await this.imageRepository.findByProjectId(projectId);
    await this.cacheService.set(key, images, this.cacheService.ttl.images);
    return images;
  }
}
