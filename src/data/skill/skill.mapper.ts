import { Skill, SkillTypeValue } from '@domain/skill';
import { Skill as PrismaSkill, SkillType } from '@prisma/client';

export class SkillMapper {
  static toDomain(row: PrismaSkill): Skill {
    return {
      id: row.id,
      title: row.title,
      icon: row.icon,
      type: row.type as SkillTypeValue,
    };
  }

  static toPrismaType(type: SkillTypeValue): SkillType {
    return type as SkillType;
  }
}
