import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  DeleteImageUseCase,
  GetImageByIdUseCase,
  GetImageBySlugUseCase,
  UpdateImageUseCase,
} from '@application/usecases/image';
import { ImageResponseDto } from '@presentation/project/dto';

import { UpdateImageDto } from '../dto';
import { ImageMapper } from '../mappers/image.mapper';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(
    private readonly getImageByIdUseCase: GetImageByIdUseCase,
    private readonly getImageBySlugUseCase: GetImageBySlugUseCase,
    private readonly updateImageUseCase: UpdateImageUseCase,
    private readonly deleteImageUseCase: DeleteImageUseCase,
  ) {}

  @ApiOkResponse({ type: ImageResponseDto })
  @HttpCode(HttpStatus.OK)
  @Get('slug/:slug')
  async getImageBySlug(@Param('slug') slug: string): Promise<ImageResponseDto> {
    const image = await this.getImageBySlugUseCase.execute(slug);
    return ImageMapper.toResponseDto(image);
  }

  @ApiOkResponse({ type: ImageResponseDto })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getImageById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ImageResponseDto> {
    const image = await this.getImageByIdUseCase.execute(id);
    return ImageMapper.toResponseDto(image);
  }

  @ApiOkResponse({ type: ImageResponseDto })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateImage(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateImageDto,
  ): Promise<ImageResponseDto> {
    const image = await this.updateImageUseCase.execute(id, dto);
    return ImageMapper.toResponseDto(image);
  }

  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteImage(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteImageUseCase.execute(id);
  }
}
