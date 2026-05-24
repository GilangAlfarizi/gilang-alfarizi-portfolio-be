import { ApiProperty } from '@nestjs/swagger';

import { GetCertificatesResponseDto } from './get-certificates-response.dto';

export class PaginatedCertificatesResponseDto {
  @ApiProperty({ type: [GetCertificatesResponseDto] })
  data: GetCertificatesResponseDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  pageSize: number;

  @ApiProperty({ example: 25 })
  total: number;

  @ApiProperty({ example: 3 })
  totalPages: number;
}
