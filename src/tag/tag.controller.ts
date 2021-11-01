import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseFilters } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomException } from 'src/exception/custom.exception';
import { ApplicationExceptionFilter } from 'src/exception/typeorm-exception.filter';
import { JwtAuthGuard } from 'src/session/jwt-session.guard';
import { Tag } from './entities/tag.entity';
import { TagService } from './tag.service';

@Controller('tag')
@ApiTags('Tag')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@UseFilters(new ApplicationExceptionFilter())
@ApiResponse({ status: 403, description: 'Forbidden.', type: CustomException })
@ApiResponse({ status: 400, description: 'Error.', type: CustomException })
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'The tags were fetched successfully.', type: [Tag] })
  findAll() {
    return this.tagService.findAll();
  }

}
