import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetProjectsResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'My Portfolio Website' })
  title: string;

  @ApiPropertyOptional({ example: 'lorem ipsum dolor sit amet' })
  description: string | null;

  @ApiPropertyOptional({
    example: 'https://ik.imagekit.io/example/cover.png',
    nullable: true,
  })
  coverImageUrl: string | null;
}
