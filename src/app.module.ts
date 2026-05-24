import { envsConfig } from '@infrastructure/envs';
import { DomainExceptionFilter } from '@infrastructure/filters';
import { PrismaModule } from '@infrastructure/prisma';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ResponseInterceptor } from '@infrastructure/interceptors';
import { HealthModule } from '@presentation/health/health.module';
import { ImageModule } from '@presentation/image/image.module';
import { ProjectModule } from '@presentation/project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envsConfig],
    }),
    PrismaModule,
    HealthModule,
    ProjectModule,
    ImageModule,
    RouterModule.register([
      {
        path: '/project',
        module: ProjectModule,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
  ],
})
export class AppModule {}
