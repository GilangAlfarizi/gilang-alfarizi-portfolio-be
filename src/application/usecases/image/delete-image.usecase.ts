import { ImageNotFoundError } from '@domain/common';
import { IMAGE_REPOSITORY, ImageRepository } from '@domain/image';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DeleteImageUseCase {
  constructor(
    @Inject(IMAGE_REPOSITORY)
    private readonly imageRepository: ImageRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const image = await this.imageRepository.findById(id);
    if (!image) {
      throw new ImageNotFoundError(id);
    }

    await this.imageRepository.delete(id);
  }
}
