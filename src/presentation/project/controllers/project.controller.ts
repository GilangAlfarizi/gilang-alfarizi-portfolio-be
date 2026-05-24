import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateProjectUseCase,
  DeleteProjectUseCase,
  GetProjectByIdUseCase,
  GetProjectsUseCase,
  UpdateProjectUseCase,
} from '@application/usecases/project';

import {
  CreateProjectDto,
  GetProjectDetailResponseDto,
  GetProjectsResponseDto,
  UpdateProjectDto,
} from '../dto';
import { ProjectMapper } from '../mappers/project.mapper';

@ApiTags('Project')
@Controller({ version: '1' })
export class ProjectController {
  constructor(
    private readonly getProjectsUseCase: GetProjectsUseCase,
    private readonly getProjectByIdUseCase: GetProjectByIdUseCase,
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly updateProjectUseCase: UpdateProjectUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
  ) {}

  @ApiOkResponse({ type: [GetProjectsResponseDto] })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getProjects(): Promise<GetProjectsResponseDto[]> {
    const projects = await this.getProjectsUseCase.execute();
    return ProjectMapper.toGetProjectsResponseDtoList(projects);
  }

  @ApiOkResponse({ type: GetProjectDetailResponseDto })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getProjectById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetProjectDetailResponseDto> {
    const project = await this.getProjectByIdUseCase.execute(id);
    return ProjectMapper.toGetProjectDetailResponseDto(project);
  }

  @ApiCreatedResponse({ type: GetProjectDetailResponseDto })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createProject(
    @Body() dto: CreateProjectDto,
  ): Promise<GetProjectDetailResponseDto> {
    const project = await this.createProjectUseCase.execute(dto);
    return ProjectMapper.toGetProjectDetailResponseDto(project);
  }

  @ApiOkResponse({ type: GetProjectDetailResponseDto })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
  ): Promise<GetProjectDetailResponseDto> {
    const project = await this.updateProjectUseCase.execute(id, dto);
    return ProjectMapper.toGetProjectDetailResponseDto(project);
  }

  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteProject(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteProjectUseCase.execute(id);
  }
}
