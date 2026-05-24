import { ProjectNotFoundError } from '@domain/common';
import { Image, IMAGE_REPOSITORY, ImageRepository } from '@domain/image';
import { PROJECT_REPOSITORY, ProjectRepository } from '@domain/project';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetImagesByProjectUseCase {
  constructor(
    @Inject(IMAGE_REPOSITORY)
    private readonly imageRepository: ImageRepository,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(projectId: number): Promise<Image[]> {
    const exists = await this.projectRepository.exists(projectId);
    if (!exists) {
      throw new ProjectNotFoundError(projectId);
    }
    return this.imageRepository.findByProjectId(projectId);
  }
}
