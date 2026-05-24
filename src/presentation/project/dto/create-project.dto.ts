import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'My Portfolio Website' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Short project summary' })
  @IsString()
  description: string;
}
