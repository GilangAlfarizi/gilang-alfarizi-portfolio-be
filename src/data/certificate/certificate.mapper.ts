import { Certificate } from '@domain/certificate';
import { Certificate as PrismaCertificate } from '@prisma/client';

export class CertificateMapper {
  static toDomain(row: PrismaCertificate): Certificate {
    return {
      id: row.id,
      title: row.title,
      issuer: row.issuer,
      image: row.image,
      validUntil: row.validUntil,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
