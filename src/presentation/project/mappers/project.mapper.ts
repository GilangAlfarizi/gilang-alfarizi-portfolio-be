import { Project, ProjectListItem } from '@domain/project';

import {
  GetProjectDetailResponseDto,
  GetProjectsResponseDto,
} from '../dto';
import { ImageMapper } from '@presentation/image/mappers/image.mapper';

export class ProjectMapper {
  static toGetProjectsResponseDto(
    item: ProjectListItem,
  ): GetProjectsResponseDto {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      coverImageUrl: item.coverImageUrl,
    };
  }

  static toGetProjectsResponseDtoList(
    items: ProjectListItem[],
  ): GetProjectsResponseDto[] {
    return items.map(ProjectMapper.toGetProjectsResponseDto);
  }

  static toGetProjectDetailResponseDto(
    project: Project,
  ): GetProjectDetailResponseDto {
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      images: ImageMapper.toResponseDtoList(project.images),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}
