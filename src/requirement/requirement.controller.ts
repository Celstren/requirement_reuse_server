import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseGuards, UsePipes, ValidationPipe, ParseArrayPipe, Put } from '@nestjs/common';
import { RequirementService } from './requirement.service';
import { CreateRequirementDto } from './dto/create-requirement.dto';
import { UpdateRequirementDto } from './dto/update-requirement.dto';
import { ApplicationExceptionFilter } from 'src/exception/typeorm-exception.filter';
import { JwtAuthGuard } from 'src/session/jwt-session.guard';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Requirement } from './entities/requirement.entity';
import { CustomException } from 'src/exception/custom.exception';

@ApiTags('Requirement')
@Controller('requirement')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiResponse({ status: 403, description: 'Forbidden.', type: CustomException })
@ApiResponse({ status: 400, description: 'Error.', type: CustomException })
@UseFilters(new ApplicationExceptionFilter())
export class RequirementController {
  constructor(private readonly requirementService: RequirementService) { }

  @Post()
  @ApiBody({ type: [CreateRequirementDto], description: 'This endpoint will receive only arrays of requirements and you can pass sub objects to create with cascade' })
  @ApiResponse({ status: 201, description: 'The requirements were created successfully.', type: [Requirement] })
  create(@Body(new ParseArrayPipe({ items: CreateRequirementDto })) createRequirementDto: CreateRequirementDto[]) {
    return this.requirementService.create(createRequirementDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'The requirements were fetched successfully.', type: [Requirement] })
  findAll() {
    return this.requirementService.findAll();
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'integer', description: 'Id from requirement to be updated' })
  @ApiBody({ type: UpdateRequirementDto, description: 'This endpoint will receive the fields to be updated and also be able to receive sub objects to upsert with cascade'  })
  @ApiResponse({ status: 200, description: 'The requirement was updated successfully.' })
  update(@Param('id') id: string, @Body() updateRequirementDto: UpdateRequirementDto) {
    return this.requirementService.update(+id, updateRequirementDto);
  }

  @Put()
  @ApiBody({ type: UpdateRequirementDto, description: 'This endpoint will update all instances given'})
  @ApiResponse({ status: 200, description: 'The requirements were updated successfully.' })
  updateSave(@Body(new ParseArrayPipe({ items: CreateRequirementDto })) createRequirementDto: CreateRequirementDto[]) {
    return this.requirementService.updateSave(createRequirementDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'integer', description: 'Id from requirement to be deleted' })
  @ApiResponse({ status: 204, description: 'The requirement was deleted successfully.' })
  remove(@Param('id') id: string) {
    return this.requirementService.remove(+id);
  }
}
