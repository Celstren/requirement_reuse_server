import { Controller, Get, Post, Body, ParseArrayPipe, UseGuards, UseFilters } from '@nestjs/common';
import { RequirementPriorityService } from './requirement-priority.service';
import { CreateRequirementPriorityDto } from './dto/create-requirement-priority.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequirementPriority } from './entities/requirement-priority.entity';
import { CustomException } from 'src/exception/custom.exception';
import { JwtAuthGuard } from 'src/session/jwt-session.guard';
import { ApplicationExceptionFilter } from 'src/exception/typeorm-exception.filter';

@ApiTags('Requirement Priority')
@Controller('requirement-priority')
@UseGuards(JwtAuthGuard)
@UseFilters(new ApplicationExceptionFilter())
@ApiBearerAuth('JWT-auth')
@ApiResponse({ status: 403, description: 'Forbidden.', type: CustomException })
@ApiResponse({ status: 400, description: 'Error.', type: CustomException })
export class RequirementPriorityController {
  constructor(private readonly requirementPriorityService: RequirementPriorityService) {}

  @Post()
  @ApiBody({ type: [CreateRequirementPriorityDto], description: 'This endpoint will receive only arrays of requirement priorities and you can pass sub objects to create with cascade' })
  @ApiResponse({ status: 201, description: 'The requirement priorities were created successfully.', type: [RequirementPriority] })
  create(@Body(new ParseArrayPipe({ items: CreateRequirementPriorityDto })) createRequirementPriorityDto: CreateRequirementPriorityDto[]) {
    return this.requirementPriorityService.create(createRequirementPriorityDto);
  }

}