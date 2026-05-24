import { Image } from '@domain/image';
import { Image as PrismaImage } from '@prisma/client';

export class ImageMapper {
  static toDomain(row: PrismaImage): Image {
    return {
      id: row.id,
      slug: row.slug,
      image: row.image,
      description: row.description,
      projectId: row.projectId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
