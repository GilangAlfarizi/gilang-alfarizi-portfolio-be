import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateImageUseCase,
  GetImagesByProjectUseCase,
} from '@application/usecases/image';
import { ImageResponseDto } from '@presentation/project/dto';
import { memoryStorage } from 'multer';

import { CreateImageDto } from '../dto';
import { ImageMapper } from '../mappers/image.mapper';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

@ApiTags('Image')
@Controller('project/:projectId/image')
export class ProjectImageController {
  constructor(
    private readonly getImagesByProjectUseCase: GetImagesByProjectUseCase,
    private readonly createImageUseCase: CreateImageUseCase,
  ) {}

  @ApiOkResponse({ type: [ImageResponseDto] })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getImagesByProject(
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<ImageResponseDto[]> {
    const images = await this.getImagesByProjectUseCase.execute(projectId);
    return ImageMapper.toResponseDtoList(images);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'slug'],
      properties: {
        file: { type: 'string', format: 'binary' },
        slug: { type: 'string', example: 'GWF-1' },
        description: { type: 'string', example: 'Homepage screenshot' },
      },
    },
  })
  @ApiCreatedResponse({ type: ImageResponseDto })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async createImage(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() dto: CreateImageDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImageResponseDto> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const image = await this.createImageUseCase.execute({
      projectId,
      slug: dto.slug,
      description: dto.description,
      file: file.buffer,
      fileName: file.originalname,
    });

    return ImageMapper.toResponseDto(image);
  }
}
