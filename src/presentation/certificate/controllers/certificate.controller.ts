import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetCertificatesUseCase } from '@application/usecases/certificate';

import { GetCertificatesResponseDto } from '../dto';
import { CertificateMapper } from '../mappers/certificate.mapper';

@ApiTags('Certificate')
@Controller('certificate')
export class CertificateController {
  constructor(private readonly getCertificatesUseCase: GetCertificatesUseCase) {}

  @ApiOkResponse({ type: [GetCertificatesResponseDto] })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getCertificates(): Promise<GetCertificatesResponseDto[]> {
    const certificates = await this.getCertificatesUseCase.execute();
    return CertificateMapper.toResponseDtoList(certificates);
  }
}
