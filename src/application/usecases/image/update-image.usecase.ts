import { ImageNotFoundError, SlugConflictError } from '@domain/common';
import {
  Image,
  IMAGE_REPOSITORY,
  ImageRepository,
  UpdateImageInput,
} from '@domain/image';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UpdateImageUseCase {
  constructor(
    @Inject(IMAGE_REPOSITORY)
    private readonly imageRepository: ImageRepository,
  ) {}

  async execute(id: number, input: UpdateImageInput): Promise<Image> {
    const existing = await this.imageRepository.findById(id);
    if (!existing) {
      throw new ImageNotFoundError(id);
    }

    if (input.slug && input.slug !== existing.slug) {
      const slugTaken = await this.imageRepository.existsBySlug(
        input.slug,
        id,
      );
      if (slugTaken) {
        throw new SlugConflictError(input.slug);
      }
    }

    return this.imageRepository.update(id, input);
  }
}
