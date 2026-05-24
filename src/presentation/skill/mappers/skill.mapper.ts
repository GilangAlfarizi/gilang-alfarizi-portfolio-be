import { Skill } from '@domain/skill';

import { GetSkillsResponseDto } from '../dto';

export class SkillMapper {
  static toResponseDto(skill: Skill): GetSkillsResponseDto {
    return {
      id: skill.id,
      title: skill.title,
      icon: skill.icon,
      type: skill.type,
    };
  }

  static toResponseDtoList(skills: Skill[]): GetSkillsResponseDto[] {
    return skills.map(SkillMapper.toResponseDto);
  }
}
