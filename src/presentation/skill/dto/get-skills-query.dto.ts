import { SkillTypeValue } from '@domain/skill';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class GetSkillsQueryDto {
  @ApiPropertyOptional({
    enum: ['FRONTEND', 'BACKEND', 'UI_UX'],
    example: 'FRONTEND',
    description: 'Filter skills by category. API uses UI_UX (not UI/UX).',
  })
  @IsOptional()
  @IsEnum(['FRONTEND', 'BACKEND', 'UI_UX'])
  type?: SkillTypeValue;
}
