import { Inject, Injectable } from '@nestjs/common';
import {
  SKILL_REPOSITORY,
  Skill,
  SkillRepository,
  SkillTypeValue,
} from '@domain/skill';
import { CacheKeys, CacheService } from '@infrastructure/cache';

@Injectable()
export class GetSkillsUseCase {
  constructor(
    @Inject(SKILL_REPOSITORY)
    private readonly skillRepository: SkillRepository,
    private readonly cacheService: CacheService,
  ) {}

  async execute(type?: SkillTypeValue): Promise<Skill[]> {
    const key = type
      ? CacheKeys.skillsByType(type)
      : CacheKeys.skillsList();
    const cached = await this.cacheService.get<Skill[]>(key);
    if (cached) {
      return cached;
    }

    const skills = await this.skillRepository.findAll(type);
    await this.cacheService.set(key, skills, this.cacheService.ttl.skills);
    return skills;
  }
}
