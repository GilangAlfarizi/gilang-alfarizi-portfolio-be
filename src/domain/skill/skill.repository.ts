import { Skill, SkillTypeValue } from './skill.entity';

export const SKILL_REPOSITORY = Symbol('SKILL_REPOSITORY');

export interface SkillRepository {
  findAll(type?: SkillTypeValue): Promise<Skill[]>;
}
