import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateImageDto {
  @ApiProperty({ example: 'GWF-1' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ example: 'Homepage screenshot' })
  @IsOptional()
  @IsString()
  description?: string;
}
