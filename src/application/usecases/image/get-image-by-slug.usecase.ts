import { ImageNotFoundError } from '@domain/common';
import { Image, IMAGE_REPOSITORY, ImageRepository } from '@domain/image';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetImageBySlugUseCase {
  constructor(
    @Inject(IMAGE_REPOSITORY)
    private readonly imageRepository: ImageRepository,
  ) {}

  async execute(slug: string): Promise<Image> {
    const image = await this.imageRepository.findBySlug(slug);
    if (!image) {
      throw new ImageNotFoundError(slug);
    }
    return image;
  }
}
