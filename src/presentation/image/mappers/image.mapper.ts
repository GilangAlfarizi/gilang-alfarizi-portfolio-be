import { Image } from '@domain/image';
import { ImageResponseDto } from '@presentation/project/dto';

export class ImageMapper {
  static toResponseDto(image: Image): ImageResponseDto {
    return {
      id: image.id,
      slug: image.slug,
      image: image.image,
      description: image.description,
      projectId: image.projectId,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
    };
  }

  static toResponseDtoList(images: Image[]): ImageResponseDto[] {
    return images.map(ImageMapper.toResponseDto);
  }
}
