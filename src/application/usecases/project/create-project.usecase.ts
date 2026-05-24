import { Inject, Injectable } from '@nestjs/common';
import {
  CreateProjectInput,
  Project,
  PROJECT_REPOSITORY,
  ProjectRepository,
} from '@domain/project';

@Injectable()
export class CreateProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(input: CreateProjectInput): Promise<Project> {
    return this.projectRepository.create(input);
  }
}
