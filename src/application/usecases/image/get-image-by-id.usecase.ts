import { ImageNotFoundError } from '@domain/common';
import { Image, IMAGE_REPOSITORY, ImageRepository } from '@domain/image';
import { CacheKeys, CacheService } from '@infrastructure/cache';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetImageByIdUseCase {
  constructor(
    @Inject(IMAGE_REPOSITORY)
    private readonly imageRepository: ImageRepository,
    private readonly cacheService: CacheService,
  ) {}

  async execute(id: number): Promise<Image> {
    const key = CacheKeys.image(id);
    const cached = await this.cacheService.get<Image>(key);
    if (cached) {
      return cached;
    }

    const image = await this.imageRepository.findById(id);
    if (!image) {
      throw new ImageNotFoundError(id);
    }

    await this.cacheService.set(key, image, this.cacheService.ttl.images);
    return image;
  }
}
