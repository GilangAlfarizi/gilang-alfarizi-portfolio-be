import { CacheService } from '@infrastructure/cache';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly cacheService: CacheService) {}

  @ApiOkResponse({
    schema: {
      example: { status: 'ok', redis: 'up' },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getHealth() {
    const redis = await this.cacheService.ping();
    return { status: 'ok', redis };
  }
}
