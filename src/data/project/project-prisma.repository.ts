import { Injectable } from '@nestjs/common';
import {
  CreateProjectInput,
  Project,
  ProjectListItem,
  ProjectRepository,
  UpdateProjectInput,
} from '@domain/project';
import { PrismaService } from '@infrastructure/prisma';

import { ProjectMapper } from './project.mapper';

@Injectable()
export class ProjectPrismaRepository implements ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllWithCoverImage(): Promise<ProjectListItem[]> {
    const projects = await this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        images: {
          take: 1,
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return projects.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      coverImageUrl: project.images[0]?.image ?? null,
    }));
  }

  async findById(id: number): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        images: { orderBy: { createdAt: 'asc' } },
      },
    });
    return project ? ProjectMapper.toDomain(project) : null;
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.prisma.project.count({ where: { id } });
    return count > 0;
  }

  async create(data: CreateProjectInput): Promise<Project> {
    const project = await this.prisma.project.create({
      data: {
        title: data.title,
        description: data.description ?? null,
      },
      include: { images: true },
    });
    return ProjectMapper.toDomain(project);
  }

  async update(id: number, data: UpdateProjectInput): Promise<Project> {
    const project = await this.prisma.project.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
      },
      include: {
        images: { orderBy: { createdAt: 'asc' } },
      },
    });
    return ProjectMapper.toDomain(project);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.project.delete({ where: { id } });
  }
}
