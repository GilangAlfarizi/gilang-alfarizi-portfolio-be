import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetCertificatesResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'AWS Certified Cloud Practitioner' })
  title: string;

  @ApiPropertyOptional({ example: 'Amazon Web Services' })
  issuer: string | null;

  @ApiPropertyOptional({ example: 'https://www.credly.com/badges/example' })
  image: string | null;

  @ApiPropertyOptional({ example: '2026-12-31T00:00:00.000Z' })
  validUntil: Date | null;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  updatedAt: Date;
}
