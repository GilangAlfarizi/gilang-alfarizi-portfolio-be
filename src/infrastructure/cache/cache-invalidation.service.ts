import { Image } from '@domain/image';
import { Injectable } from '@nestjs/common';

import { CacheKeys } from './cache.keys';
import { CacheService } from './cache.service';

@Injectable()
export class CacheInvalidationService {
  constructor(private readonly cache: CacheService) {}

  async invalidateProjectsList(): Promise<void> {
    await this.cache.del(CacheKeys.projectsList());
  }

  async invalidateProject(projectId: number): Promise<void> {
    await this.cache.del(
      CacheKeys.projectsList(),
      CacheKeys.project(projectId),
      CacheKeys.projectImages(projectId),
    );
  }

  async invalidateImage(image: Pick<Image, 'id' | 'slug' | 'projectId'>): Promise<void> {
    await this.cache.del(
      CacheKeys.projectsList(),
      CacheKeys.project(image.projectId),
      CacheKeys.projectImages(image.projectId),
      CacheKeys.image(image.id),
      CacheKeys.imageBySlug(image.slug),
    );
  }

  async invalidateImageSlugChange(
    previousSlug: string,
    image: Pick<Image, 'id' | 'slug' | 'projectId'>,
  ): Promise<void> {
    await this.cache.del(CacheKeys.imageBySlug(previousSlug));
    await this.invalidateImage(image);
  }
}
