import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetCertificatesResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'AWS Certified Cloud Practitioner' })
  title: string;

  @ApiPropertyOptional({ example: 'Amazon Web Services' })
  issuer: string | null;

  @ApiPropertyOptional({ example: '2024-06-01' })
  issuedAt: string | null;

  @ApiPropertyOptional({
    example: 'https://ik.imagekit.io/example/cert-badge.png',
  })
  image: string | null;

  @ApiPropertyOptional({
    example: 'https://www.credly.com/badges/example',
    description: 'Link to verify or view the credential',
  })
  credential: string | null;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  updatedAt: Date;
}
