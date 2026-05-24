import { Project } from '@domain/project';
import { Image as PrismaImage, Project as PrismaProject } from '@prisma/client';

import { ImageMapper } from '../image/image.mapper';

export type ProjectWithImages = PrismaProject & { images: PrismaImage[] };

export class ProjectMapper {
  static toDomain(row: ProjectWithImages): Project {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      images: row.images.map(ImageMapper.toDomain),
    };
  }

  static toDomainWithoutImages(row: PrismaProject): Project {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      images: [],
    };
  }
}
