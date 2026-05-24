import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetSkillsUseCase } from '@application/usecases/skill';

import { GetSkillsQueryDto, GetSkillsResponseDto } from '../dto';
import { SkillMapper } from '../mappers/skill.mapper';

@ApiTags('Skill')
@Controller('skill')
export class SkillController {
  constructor(private readonly getSkillsUseCase: GetSkillsUseCase) {}

  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['FRONTEND', 'BACKEND', 'UI_UX'],
  })
  @ApiOkResponse({ type: [GetSkillsResponseDto] })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getSkills(
    @Query() query: GetSkillsQueryDto,
  ): Promise<GetSkillsResponseDto[]> {
    const skills = await this.getSkillsUseCase.execute(query.type);
    return SkillMapper.toResponseDtoList(skills);
  }
}
