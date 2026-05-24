import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ImageResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'GWF-1' })
  slug: string;

  @ApiProperty({ example: 'https://ik.imagekit.io/example/Works/GWF-1.png' })
  image: string;

  @ApiProperty({ example: 'Screenshot of homepage' })
  description: string;

  @ApiProperty({ example: 1 })
  projectId: number;

  @ApiProperty({ example: '2024-05-25T04:51:37.660Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-05-25T04:51:37.660Z' })
  updatedAt: Date;
}
