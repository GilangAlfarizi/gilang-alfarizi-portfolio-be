import { Project, CreateProjectInput, UpdateProjectInput } from './project.entity';
import { ProjectListItem } from './project-list-item';

export const PROJECT_REPOSITORY = Symbol('PROJECT_REPOSITORY');

export interface ProjectRepository {
  findAllWithCoverImage(): Promise<ProjectListItem[]>;
  findById(id: number): Promise<Project | null>;
  exists(id: number): Promise<boolean>;
  create(data: CreateProjectInput): Promise<Project>;
  update(id: number, data: UpdateProjectInput): Promise<Project>;
  delete(id: number): Promise<void>;
}
