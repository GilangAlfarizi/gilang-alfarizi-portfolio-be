import {
  ImageNotFoundError,
  ProjectNotFoundError,
  SlugConflictError,
} from '@domain/common';
import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(ProjectNotFoundError, ImageNotFoundError, SlugConflictError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | ProjectNotFoundError
      | ImageNotFoundError
      | SlugConflictError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof SlugConflictError) {
      response
        .status(409)
        .json(new ConflictException(exception.message).getResponse());
      return;
    }

    response
      .status(404)
      .json(new NotFoundException(exception.message).getResponse());
  }
}
