import * as usecases from '@application/usecases/skill';
import { SkillPrismaRepository } from '@data/skill';
import { SKILL_REPOSITORY } from '@domain/skill';
import { Module } from '@nestjs/common';

import * as controllers from './controllers';

@Module({
  controllers: [...Object.values(controllers)],
  providers: [
    ...Object.values(usecases),
    {
      provide: SKILL_REPOSITORY,
      useClass: SkillPrismaRepository,
    },
  ],
})
export class SkillModule {}
