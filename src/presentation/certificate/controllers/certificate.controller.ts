import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetCertificatesUseCase } from '@application/usecases/certificate';

import {
  GetCertificatesQueryDto,
  PaginatedCertificatesResponseDto,
} from '../dto';
import { CertificateMapper } from '../mappers/certificate.mapper';

@ApiTags('Certificate')
@Controller('certificate')
export class CertificateController {
  constructor(private readonly getCertificatesUseCase: GetCertificatesUseCase) {}

  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiOkResponse({ type: PaginatedCertificatesResponseDto })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getCertificates(
    @Query() query: GetCertificatesQueryDto,
  ): Promise<PaginatedCertificatesResponseDto> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const result = await this.getCertificatesUseCase.execute({ page, pageSize });
    return CertificateMapper.toPaginatedResponseDto(result);
  }
}
