import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateImageDto {
  @ApiProperty({ example: 'GWF-1' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Homepage screenshot' })
  @IsString()
  description: string;
}
