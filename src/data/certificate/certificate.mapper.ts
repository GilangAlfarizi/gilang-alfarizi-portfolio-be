import { Certificate } from '@domain/certificate';
import { Certificate as PrismaCertificate } from '@prisma/client';

export class CertificateMapper {
  static toDomain(row: PrismaCertificate): Certificate {
    return {
      id: row.id,
      title: row.title,
      issuer: row.issuer,
      issuedAt: row.issuedAt,
      image: row.image,
      credential: row.credential,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
