import { Injectable } from '@nestjs/common';
import {
  CertificatePaginationParams,
  CertificateRepository,
  PaginatedCertificates,
} from '@domain/certificate';
import { PrismaService } from '@infrastructure/prisma';

import { CertificateMapper } from './certificate.mapper';

@Injectable()
export class CertificatePrismaRepository implements CertificateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPaginated(
    params: CertificatePaginationParams,
  ): Promise<PaginatedCertificates> {
    const { page, pageSize } = params;
    const skip = (page - 1) * pageSize;

    const [rows, total] = await Promise.all([
      this.prisma.certificate.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.certificate.count(),
    ]);

    return {
      data: rows.map(CertificateMapper.toDomain),
      page,
      pageSize,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / pageSize),
    };
  }
}
