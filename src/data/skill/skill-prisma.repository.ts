import { Injectable } from '@nestjs/common';
import { Skill, SkillRepository, SkillTypeValue } from '@domain/skill';
import { PrismaService } from '@infrastructure/prisma';

import { SkillMapper } from './skill.mapper';

@Injectable()
export class SkillPrismaRepository implements SkillRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(type?: SkillTypeValue): Promise<Skill[]> {
    const rows = await this.prisma.skill.findMany({
      where: type ? { type: SkillMapper.toPrismaType(type) } : undefined,
      orderBy: [{ type: 'asc' }, { title: 'asc' }],
    });
    return rows.map(SkillMapper.toDomain);
  }
}
