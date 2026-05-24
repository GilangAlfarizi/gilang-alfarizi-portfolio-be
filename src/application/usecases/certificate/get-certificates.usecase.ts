import { Inject, Injectable } from '@nestjs/common';
import {
  CERTIFICATE_REPOSITORY,
  CertificatePaginationParams,
  CertificateRepository,
  PaginatedCertificates,
} from '@domain/certificate';
import { CacheKeys, CacheService } from '@infrastructure/cache';

@Injectable()
export class GetCertificatesUseCase {
  constructor(
    @Inject(CERTIFICATE_REPOSITORY)
    private readonly certificateRepository: CertificateRepository,
    private readonly cacheService: CacheService,
  ) {}

  async execute(
    params: CertificatePaginationParams,
  ): Promise<PaginatedCertificates> {
    const key = CacheKeys.certificatesList(params.page, params.pageSize);
    const cached = await this.cacheService.get<PaginatedCertificates>(key);
    if (cached) {
      return cached;
    }

    const result = await this.certificateRepository.findPaginated(params);
    await this.cacheService.set(
      key,
      result,
      this.cacheService.ttl.certificates,
    );
    return result;
  }
}
