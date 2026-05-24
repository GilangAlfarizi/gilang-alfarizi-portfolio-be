import { SkillTypeValue } from '@domain/skill';
import { ApiProperty } from '@nestjs/swagger';

export class GetSkillsResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'React' })
  title: string;

  @ApiProperty({
    example: 'react',
    description: 'Frontend icon key — map to your icon set in the UI, not a URL',
  })
  icon: string;

  @ApiProperty({
    enum: ['FRONTEND', 'BACKEND', 'UI_UX'],
    example: 'FRONTEND',
  })
  type: SkillTypeValue;
}
