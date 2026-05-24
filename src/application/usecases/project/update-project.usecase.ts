import { ProjectNotFoundError } from '@domain/common';
import { Inject, Injectable } from '@nestjs/common';
import {
  Project,
  PROJECT_REPOSITORY,
  ProjectRepository,
  UpdateProjectInput,
} from '@domain/project';

@Injectable()
export class UpdateProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(id: number, input: UpdateProjectInput): Promise<Project> {
    const exists = await this.projectRepository.exists(id);
    if (!exists) {
      throw new ProjectNotFoundError(id);
    }
    return this.projectRepository.update(id, input);
  }
}
