import * as usecases from '@application/usecases/project';
import { ProjectPrismaRepository } from '@data/project';
import { PROJECT_REPOSITORY } from '@domain/project';
import { Module } from '@nestjs/common';

import * as controllers from './controllers';

@Module({
  controllers: [...Object.values(controllers)],
  providers: [
    ...Object.values(usecases),
    {
      provide: PROJECT_REPOSITORY,
      useClass: ProjectPrismaRepository,
    },
  ],
})
export class ProjectModule {}
