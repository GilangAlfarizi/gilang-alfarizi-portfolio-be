import { Certificate } from '@domain/certificate';

import { GetCertificatesResponseDto } from '../dto';

export class CertificateMapper {
  static toResponseDto(certificate: Certificate): GetCertificatesResponseDto {
    return {
      id: certificate.id,
      title: certificate.title,
      issuer: certificate.issuer,
      url: certificate.url,
      validUntil: certificate.validUntil,
      createdAt: certificate.createdAt,
      updatedAt: certificate.updatedAt,
    };
  }

  static toResponseDtoList(
    certificates: Certificate[],
  ): GetCertificatesResponseDto[] {
    return certificates.map(CertificateMapper.toResponseDto);
  }
}
