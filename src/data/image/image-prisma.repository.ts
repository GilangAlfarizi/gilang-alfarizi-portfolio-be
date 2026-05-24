import { Injectable } from '@nestjs/common';
import {
  CreateImageInput,
  Image,
  ImageRepository,
  UpdateImageInput,
} from '@domain/image';
import { PrismaService } from '@infrastructure/prisma';

import { ImageMapper } from './image.mapper';

@Injectable()
export class ImagePrismaRepository implements ImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByProjectId(projectId: number): Promise<Image[]> {
    const rows = await this.prisma.image.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map(ImageMapper.toDomain);
  }

  async findById(id: number): Promise<Image | null> {
    const row = await this.prisma.image.findUnique({ where: { id } });
    return row ? ImageMapper.toDomain(row) : null;
  }

  async findBySlug(slug: string): Promise<Image | null> {
    const row = await this.prisma.image.findFirst({ where: { slug } });
    return row ? ImageMapper.toDomain(row) : null;
  }

  async existsBySlug(slug: string, excludeId?: number): Promise<boolean> {
    const row = await this.prisma.image.findFirst({
      where: {
        slug,
        ...(excludeId !== undefined ? { id: { not: excludeId } } : {}),
      },
    });
    return row !== null;
  }

  async create(data: CreateImageInput): Promise<Image> {
    const row = await this.prisma.image.create({
      data: {
        slug: data.slug,
        image: data.image,
        description: data.description ?? null,
        projectId: data.projectId,
      },
    });
    return ImageMapper.toDomain(row);
  }

  async update(id: number, data: UpdateImageInput): Promise<Image> {
    const row = await this.prisma.image.update({
      where: { id },
      data: {
        ...(data.slug !== undefined ? { slug: data.slug } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
      },
    });
    return ImageMapper.toDomain(row);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.image.delete({ where: { id } });
  }
}
