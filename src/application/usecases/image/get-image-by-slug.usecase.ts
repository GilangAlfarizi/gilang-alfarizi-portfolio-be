import { ImageNotFoundError } from '@domain/common';
import { Image, IMAGE_REPOSITORY, ImageRepository } from '@domain/image';
import { CacheKeys, CacheService } from '@infrastructure/cache';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetImageBySlugUseCase {
  constructor(
    @Inject(IMAGE_REPOSITORY)
    private readonly imageRepository: ImageRepository,
    private readonly cacheService: CacheService,
  ) {}

  async execute(slug: string): Promise<Image> {
    const key = CacheKeys.imageBySlug(slug);
    const cached = await this.cacheService.get<Image>(key);
    if (cached) {
      return cached;
    }

    const image = await this.imageRepository.findBySlug(slug);
    if (!image) {
      throw new ImageNotFoundError(slug);
    }

    await this.cacheService.set(key, image, this.cacheService.ttl.images);
    return image;
  }
}
