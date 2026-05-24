import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @ApiOkResponse({ schema: { example: { status: 'ok' } } })
  @HttpCode(HttpStatus.OK)
  @Get()
  getHealth() {
    return { status: 'ok' };
  }
}
