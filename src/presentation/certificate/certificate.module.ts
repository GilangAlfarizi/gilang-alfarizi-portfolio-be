import * as usecases from '@application/usecases/certificate';
import { CertificatePrismaRepository } from '@data/certificate';
import { CERTIFICATE_REPOSITORY } from '@domain/certificate';
import { Module } from '@nestjs/common';

import * as controllers from './controllers';

@Module({
  controllers: [...Object.values(controllers)],
  providers: [
    ...Object.values(usecases),
    {
      provide: CERTIFICATE_REPOSITORY,
      useClass: CertificatePrismaRepository,
    },
  ],
})
export class CertificateModule {}
