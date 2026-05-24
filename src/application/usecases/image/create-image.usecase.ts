import { ProjectNotFoundError, SlugConflictError } from '@domain/common';
import { Image, IMAGE_REPOSITORY, ImageRepository } from '@domain/image';
import { PROJECT_REPOSITORY, ProjectRepository } from '@domain/project';
import { ImageKitService } from '@infrastructure/imagekit';
import { Inject, Injectable } from '@nestjs/common';

export type CreateImageCommand = {
  projectId: number;
  slug: string;
  description?: string | null;
  file: Buffer;
  fileName: string;
};

@Injectable()
export class CreateImageUseCase {
  constructor(
    @Inject(IMAGE_REPOSITORY)
    private readonly imageRepository: ImageRepository,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    private readonly imageKitService: ImageKitService,
  ) {}

  async execute(command: CreateImageCommand): Promise<Image> {
    const { projectId, slug, description, file, fileName } = command;

    const projectExists = await this.projectRepository.exists(projectId);
    if (!projectExists) {
      throw new ProjectNotFoundError(projectId);
    }

    const slugTaken = await this.imageRepository.existsBySlug(slug);
    if (slugTaken) {
      throw new SlugConflictError(slug);
    }

    const upload = await this.imageKitService.upload(file, fileName);

    try {
      return await this.imageRepository.create({
        slug,
        description: description ?? null,
        projectId,
        image: upload.url,
      });
    } catch (error) {
      await this.imageKitService.delete(upload.fileId).catch(() => undefined);
      throw error;
    }
  }
}
