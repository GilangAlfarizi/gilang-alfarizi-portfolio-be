import { ProjectNotFoundError } from '@domain/common';
import { Inject, Injectable } from '@nestjs/common';
import { Project, PROJECT_REPOSITORY, ProjectRepository } from '@domain/project';

@Injectable()
export class GetProjectByIdUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(id: number): Promise<Project> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new ProjectNotFoundError(id);
    }
    return project;
  }
}
