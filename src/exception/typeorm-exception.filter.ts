import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { CustomException } from './custom.exception';

@Catch(QueryFailedError, HttpException, BadRequestException, Error)
export class ApplicationExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {

    console.log(exception)

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const {status,exception: customException} = CustomException.fromApplicationException(exception,request.url);

    response
      .status(status)
      .json(customException);
  }
}