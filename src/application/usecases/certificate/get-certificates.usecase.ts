import { Inject, Injectable } from '@nestjs/common';
import {
  CERTIFICATE_REPOSITORY,
  Certificate,
  CertificateRepository,
} from '@domain/certificate';
import { CacheKeys, CacheService } from '@infrastructure/cache';

@Injectable()
export class GetCertificatesUseCase {
  constructor(
    @Inject(CERTIFICATE_REPOSITORY)
    private readonly certificateRepository: CertificateRepository,
    private readonly cacheService: CacheService,
  ) {}

  async execute(): Promise<Certificate[]> {
    const key = CacheKeys.certificatesList();
    const cached = await this.cacheService.get<Certificate[]>(key);
    if (cached) {
      return cached;
    }

    const certificates = await this.certificateRepository.findAll();
    await this.cacheService.set(
      key,
      certificates,
      this.cacheService.ttl.certificates,
    );
    return certificates;
  }
}
