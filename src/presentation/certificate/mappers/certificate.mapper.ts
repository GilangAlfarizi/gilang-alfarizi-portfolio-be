import { Certificate, PaginatedCertificates } from '@domain/certificate';

import {
  GetCertificatesResponseDto,
  PaginatedCertificatesResponseDto,
} from '../dto';

export class CertificateMapper {
  static toResponseDto(certificate: Certificate): GetCertificatesResponseDto {
    return {
      id: certificate.id,
      title: certificate.title,
      issuer: certificate.issuer,
      issuedAt: certificate.issuedAt,
      image: certificate.image,
      credential: certificate.credential,
      createdAt: certificate.createdAt,
      updatedAt: certificate.updatedAt,
    };
  }

  static toResponseDtoList(
    certificates: Certificate[],
  ): GetCertificatesResponseDto[] {
    return certificates.map(CertificateMapper.toResponseDto);
  }

  static toPaginatedResponseDto(
    result: PaginatedCertificates,
  ): PaginatedCertificatesResponseDto {
    return {
      data: CertificateMapper.toResponseDtoList(result.data),
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
      totalPages: result.totalPages,
    };
  }
}
