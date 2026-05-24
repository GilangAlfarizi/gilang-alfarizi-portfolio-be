import { Inject, Injectable } from '@nestjs/common';
import {
  PROJECT_REPOSITORY,
  ProjectListItem,
  ProjectRepository,
} from '@domain/project';

@Injectable()
export class GetProjectsUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(): Promise<ProjectListItem[]> {
    return this.projectRepository.findAllWithCoverImage();
  }
}
