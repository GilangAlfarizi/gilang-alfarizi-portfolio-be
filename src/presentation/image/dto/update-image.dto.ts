import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateImageDto {
  @ApiPropertyOptional({ example: 'GWF-2' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  slug?: string;

  @ApiPropertyOptional({ example: 'Updated caption' })
  @IsOptional()
  @IsString()
  description?: string;
}
