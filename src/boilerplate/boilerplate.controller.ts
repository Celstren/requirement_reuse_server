import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CustomException } from 'src/exception/custom.exception';
import { ApplicationExceptionFilter } from 'src/exception/typeorm-exception.filter';
import { JwtAuthGuard } from 'src/session/jwt-session.guard';
import { BoilerplateService } from './boilerplate.service';
import { CreateBoilerplateDto } from './dto/create-boilerplate.dto';
import { UpdateBoilerplateDto } from './dto/update-boilerplate.dto';
import { Boilerplate } from './entities/boilerplate.entity';


@ApiTags('Boilerplate')
@Controller('boilerplate')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@UseFilters(new ApplicationExceptionFilter())
@ApiResponse({ status: 403, description: 'Forbidden.', type: CustomException })
@ApiResponse({ status: 400, description: 'Error.', type: CustomException })
export class BoilerplateController {
  constructor(private readonly boilerplateService: BoilerplateService) {}

  @Post('generate/:marketTypeId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiParam({ name: 'id', type: 'integer', description: 'Id from market type used to generate boilerplates' })
  @ApiBody({ type: CreateBoilerplateDto })
  @ApiResponse({ status: 201, description: 'The boilerplates were generated successfully.', type: Boilerplate })
  autogenerate(@Param('marketTypeId') id: number, @Body() createBoilerplateDto: CreateBoilerplateDto[]) {
    return this.boilerplateService.autogenerate(createBoilerplateDto, id);
  }

  @Get('market-type/:id')
  @ApiParam({ name: 'id', type: 'integer', description: 'Id from market type used to filter boilerplates' })
  @ApiResponse({ status: 200, description: 'The boilerplates from specified market type were fetched successfully.', type: Boilerplate })
  findRawRequirementsByMarketTypeId(@Param('id') id: number) {
    return this.boilerplateService.findByMarketType(+id);
  }

  // @Post()
  // create(@Body() createBoilerplateDto: CreateBoilerplateDto) {
  //   return this.boilerplateService.create(createBoilerplateDto);
  // }

  // @Get()
  // findAll() {
  //   return this.boilerplateService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.boilerplateService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBoilerplateDto: UpdateBoilerplateDto) {
  //   return this.boilerplateService.update(+id, updateBoilerplateDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.boilerplateService.remove(+id);
  // }
}
