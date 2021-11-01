import { Controller, Get, Post, Request, Body, Patch, Param, Delete, UseFilters, UseGuards, ParseArrayPipe } from '@nestjs/common';
import { ProductBacklogService } from './product-backlog.service';
import { CreateProductBacklogDto } from './dto/create-product-backlog.dto';
import { UpdateProductBacklogDto } from './dto/update-product-backlog.dto';
import { ApplicationExceptionFilter } from 'src/exception/typeorm-exception.filter';
import { JwtAuthGuard } from 'src/session/jwt-session.guard';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductBacklog } from './entities/product-backlog.entity';
import { CustomException } from 'src/exception/custom.exception';

@ApiTags('Product Backlog')
@Controller('product-backlog')
@UseGuards(JwtAuthGuard)
@UseFilters(new ApplicationExceptionFilter())
@ApiBearerAuth('JWT-auth')
@ApiResponse({ status: 403, description: 'Forbidden.', type: CustomException })
@ApiResponse({ status: 400, description: 'Error.', type: CustomException })
export class ProductBacklogController {
  constructor(private readonly productBacklogService: ProductBacklogService) {}

  @Post()
  @ApiBody({ type: [CreateProductBacklogDto], description: 'This endpoint will receive only arrays of product backlogs and you can pass sub objects to create with cascade' })
  @ApiResponse({ status: 201, description: 'The product backlogs were created successfully.', type: [ProductBacklog] })
  create(@Body(new ParseArrayPipe({ items: CreateProductBacklogDto })) createProductBacklogDto: CreateProductBacklogDto[]) {
    return this.productBacklogService.create(createProductBacklogDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'The product backlogs were fetched successfully.', type: [ProductBacklog] })
  findAll() {
    return this.productBacklogService.findAll();
  }

  @Get('/project/:id')
  @ApiParam({ name: 'id', type: 'integer', description: 'Id from specified project' })
  @ApiResponse({ status: 200, description: 'The product backlogs from specified project were fetched successfully.', type: [ProductBacklog] })
  findByProfileUserId(@Param('id') id: number) {
    return this.productBacklogService.findByProjectId(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'integer', description: 'Id from product backlog to be updated' })
  @ApiBody({ type: UpdateProductBacklogDto, description: 'This endpoint will receive the fields to be updated and also be able to receive sub objects to upsert with cascade'  })
  @ApiResponse({ status: 200, description: 'The product backlog was updated successfully.' })
  update(@Param('id') id: number, @Body() updateProductBacklogDto: UpdateProductBacklogDto) {
    return this.productBacklogService.update(+id, updateProductBacklogDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'integer', description: 'Id from product backlog to be deleted' })
  @ApiResponse({ status: 204, description: 'The product backlog was deleted successfully.' })
  remove(@Param('id') id: number) {
    return this.productBacklogService.remove(+id);
  }
}
