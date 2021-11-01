import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CustomException } from 'src/exception/custom.exception';
import { ApplicationExceptionFilter } from 'src/exception/typeorm-exception.filter';
import { JwtAuthGuard } from 'src/session/jwt-session.guard';
import { CreateGeneratedProjectAvailableDto } from './dto/create-generated-project-available.dto';
import { UpdateGeneratedProjectAvailableDto } from './dto/update-generated-project-available.dto';
import { GeneratedProjectAvailable } from './entities/generated-project-available.entity';
import { GeneratedProjectAvailableService } from './generated-project-available.service';

@ApiTags('Generated Project Available')
@Controller('generated-project-available')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiResponse({ status: 403, description: 'Forbidden.', type: CustomException })
@ApiResponse({ status: 400, description: 'Error.', type: CustomException })
export class GeneratedProjectAvailableController {
  constructor(private readonly generatedProjectAvailableService: GeneratedProjectAvailableService) {}

  @Post()
  @UseFilters(new ApplicationExceptionFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBody({ type: CreateGeneratedProjectAvailableDto })
  @ApiResponse({ status: 201, description: 'The generated project available was created successfully.', type: GeneratedProjectAvailable })
  create(@Body() createGeneratedProjectAvailableDto: CreateGeneratedProjectAvailableDto) {
    return this.generatedProjectAvailableService.create(createGeneratedProjectAvailableDto);
  }

  @Get()
  @UseFilters(new ApplicationExceptionFilter())
  @ApiResponse({ status: 200, description: 'The list of generated projects available fetched.', type: [GeneratedProjectAvailable] })
  findAll() {
    return this.generatedProjectAvailableService.findAll();
  }

  @Get(':id')
  @UseFilters(new ApplicationExceptionFilter())
  @ApiResponse({ status: 200, description: 'The generated project available requested.', type: [GeneratedProjectAvailable] })
  findOne(@Param('id') id: string) {
    return this.generatedProjectAvailableService.findOne(+id);
  }

  @Get(':marketTypeId')
  @UseFilters(new ApplicationExceptionFilter())
  @ApiResponse({ status: 200, description: 'The generated project available requested by market type id.', type: [GeneratedProjectAvailable] })
  findByMarketTypeId(@Param('marketTypeId') marketTypeId: string) {
    return this.generatedProjectAvailableService.findByMarketId(+marketTypeId);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'integer', description: 'Id from generated project available to be updated' })
  @ApiBody({ type: UpdateGeneratedProjectAvailableDto, description: 'This endpoint will receive the fields to be updated'  })
  @ApiResponse({ status: 200, description: 'The generated project available was updated successfully.' })
  update(@Param('id') id: string, @Body() updateGeneratedProjectAvailableDto: UpdateGeneratedProjectAvailableDto) {
    return this.generatedProjectAvailableService.update(+id, updateGeneratedProjectAvailableDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'integer', description: 'Id from generated project available to be deleted' })
  @ApiResponse({ status: 204, description: 'The generated project available was deleted successfully.' })
  remove(@Param('id') id: string) {
    return this.generatedProjectAvailableService.remove(+id);
  }
}
