import { Injectable } from '@nestjs/common';
import { Certificate, CertificateRepository } from '@domain/certificate';
import { PrismaService } from '@infrastructure/prisma';

import { CertificateMapper } from './certificate.mapper';

@Injectable()
export class CertificatePrismaRepository implements CertificateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Certificate[]> {
    const rows = await this.prisma.certificate.findMany({
      orderBy: [{ validUntil: 'desc' }, { createdAt: 'desc' }],
    });
    return rows.map(CertificateMapper.toDomain);
  }
}
