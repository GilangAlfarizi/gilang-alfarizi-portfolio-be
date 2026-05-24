import { ProjectNotFoundError } from '@domain/common';
import { Inject, Injectable } from '@nestjs/common';
import { PROJECT_REPOSITORY, ProjectRepository } from '@domain/project';

@Injectable()
export class DeleteProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const exists = await this.projectRepository.exists(id);
    if (!exists) {
      throw new ProjectNotFoundError(id);
    }
    await this.projectRepository.delete(id);
  }
}
