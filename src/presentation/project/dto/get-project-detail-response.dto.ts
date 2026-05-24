import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ImageResponseDto } from './image-response.dto';

export class GetProjectDetailResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'My Portfolio Website' })
  title: string;

  @ApiPropertyOptional({ example: 'Project description' })
  description: string | null;

  @ApiProperty({ type: [ImageResponseDto] })
  images: ImageResponseDto[];

  @ApiProperty({ example: '2023-11-16T18:31:49.474Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-10T07:56:44.998Z' })
  updatedAt: Date;
}
