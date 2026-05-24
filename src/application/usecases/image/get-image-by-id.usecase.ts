import { ImageNotFoundError } from '@domain/common';
import { Image, IMAGE_REPOSITORY, ImageRepository } from '@domain/image';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetImageByIdUseCase {
  constructor(
    @Inject(IMAGE_REPOSITORY)
    private readonly imageRepository: ImageRepository,
  ) {}

  async execute(id: number): Promise<Image> {
    const image = await this.imageRepository.findById(id);
    if (!image) {
      throw new ImageNotFoundError(id);
    }
    return image;
  }
}
