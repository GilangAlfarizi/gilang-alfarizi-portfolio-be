import * as usecases from '@application/usecases/image';
import { ImagePrismaRepository } from '@data/image';
import { ProjectPrismaRepository } from '@data/project';
import { IMAGE_REPOSITORY } from '@domain/image';
import { PROJECT_REPOSITORY } from '@domain/project';
import { ImageKitModule } from '@infrastructure/imagekit';
import { Module } from '@nestjs/common';

import * as controllers from './controllers';

@Module({
  imports: [ImageKitModule],
  controllers: [...Object.values(controllers)],
  providers: [
    ...Object.values(usecases),
    {
      provide: IMAGE_REPOSITORY,
      useClass: ImagePrismaRepository,
    },
    {
      provide: PROJECT_REPOSITORY,
      useClass: ProjectPrismaRepository,
    },
  ],
})
export class ImageModule {}
