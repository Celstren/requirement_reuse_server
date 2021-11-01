import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from 'src/session/jwt-session.guard';
import { UseFilters } from '@nestjs/common';
import { ApplicationExceptionFilter } from 'src/exception/typeorm-exception.filter';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomException } from 'src/exception/custom.exception';
import { Project } from './entities/project.entity';
import { Pagination } from 'src/pagination';
import { ProjectExcelService } from './project-excel/project-excel.service';
import { ProjectExcelResponseDto } from './project-excel/dto/project-excel-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/multer/multer.config';
import { Requirement } from 'src/requirement/entities/requirement.entity';
import { CreateProjectRequirementDto } from './dto/create-project-requirement.dto';

@ApiTags('Project')
@Controller('project')
@UseGuards(JwtAuthGuard)
@UseFilters(new ApplicationExceptionFilter())
@ApiBearerAuth('JWT-auth')
@ApiResponse({ status: 403, description: 'Forbidden.', type: CustomException })
@ApiResponse({ status: 400, description: 'Error.', type: CustomException })
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly excelService: ProjectExcelService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBody({
    type: CreateProjectDto,
    description:
      'This endpoint will receive a project and you can pass sub objects to create with cascade',
  })
  @ApiResponse({
    status: 201,
    description: 'The project was created successfully.',
    type: [Project],
  })
  create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(req.user.userId, createProjectDto);
  }

  @Post('/create-from-requirements/:marketTypeId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiParam({ name: 'id', type: 'integer', description: 'Id from market type used to filter projects' })
  @ApiBody({ type: [CreateProjectRequirementDto], description: 'This endpoint will receive projects to create with its requirements' })
  @ApiResponse({ status: 201, description: 'The project was generated successfully.', type: [Project] })
  createFromRequirements(@Request() req, @Param('marketTypeId') marketTypeId: number, @Body() createProjectRequirementDto: CreateProjectRequirementDto[]) {
    return this.projectService.createFromRequirements(req.user.userId, marketTypeId, createProjectRequirementDto);
  }

  @Get()
  @ApiOperation({
    description:
      'This endpoint will paginate all fetched public projects that meets the filters entered',
  })
  @ApiQuery({
    name: 'limit',
    description: 'The max size of elements that can be fetched from the server',
    type: 'integer',
  })
  @ApiQuery({
    name: 'page',
    description: 'The page of the elements fetched from server',
    type: 'integer',
  })
  @ApiQuery({
    name: 'query',
    description:
      'The query will help to find elements that match with the words entered and the name of the projects registered',
    type: Number,
  })
  @ApiQuery({
    name: 'projectNameOrder',
    description: 'Value to order results referenced by project name',
    type: String,
  })
  @ApiQuery({
    name: 'createdAtOrder',
    description: 'Value to order results referenced by created date',
    type: String,
  })
  @ApiQuery({
    name: 'marketTypeOrder',
    description: 'Value to order results referenced by market type',
    type: String,
  })
  @ApiQuery({
    name: 'from',
    description:
      'Filter results by the created date starting from the value entered. Value must be ISO format (2021-08-08T04:44:45Z)',
    type: String,
  })
  @ApiQuery({
    name: 'to',
    description:
      'Filter results by the created until the value entered. Value must be ISO format (2021-08-08T04:44:45Z)',
    type: String,
  })
  @ApiQuery({
    name: 'marketType',
    description: 'Filter results by the market type id entered',
    type: Number,
  })
  @ApiBody({
    description: 'Id array to filter results by tags',
    type: [Number],
  })
  @ApiResponse({
    status: 200,
    description: 'The projects were fetched successfully.',
    type: Pagination,
  })
  findAll(
    @Request() request,
    @Body() tagIds: number[],
  ): Promise<Pagination<Project>> {
    return this.projectService.findAllPaginated({
      limit: request.query.hasOwnProperty('limit') ? request.query.limit : 10,
      page: request.query.hasOwnProperty('page') ? request.query.page : 0,
      query: request.query.hasOwnProperty('query') ? request.query.query : '',
      projectNameOrder: request.query.projectNameOrder,
      createdAtOrder: request.query.createdAtOrder,
      marketTypeOrder: request.query.marketTypeOrder,
      from: request.query.from,
      to: request.query.to,
      tags: tagIds,
      marketType: request.query.marketType,
    });
  }

  @Get('/profile-user')
  @ApiOperation({
    description:
      'This endpoint will extract the profile user id from token to filter only public projects created by current user',
  })
  @ApiQuery({
    name: 'limit',
    description: 'The max size of elements that can be fetched from the server',
    type: 'integer',
  })
  @ApiQuery({
    name: 'page',
    description: 'The page of the elements fetched from server',
    type: 'integer',
  })
  @ApiQuery({
    name: 'query',
    description:
      'The query will help to find elements that match with the words entered and the name of the projects registered',
    type: String,
  })
  @ApiQuery({
    name: 'projectNameOrder',
    description: 'Value to order results referenced by project name',
    type: String,
  })
  @ApiQuery({
    name: 'createdAtOrder',
    description: 'Value to order results referenced by created date',
    type: String,
  })
  @ApiQuery({
    name: 'marketTypeOrder',
    description: 'Value to order results referenced by market type',
    type: String,
  })
  @ApiQuery({
    name: 'from',
    description:
      'Filter results by the created date starting from the value entered. Value must be ISO format (2021-08-08T04:44:45Z)',
    type: String,
  })
  @ApiQuery({
    name: 'to',
    description:
      'Filter results by the created until the value entered. Value must be ISO format (2021-08-08T04:44:45Z)',
    type: String,
  })
  @ApiQuery({
    name: 'marketType',
    description: 'Filter results by the market type id entered',
    type: Number,
  })
  @ApiBody({
    description: 'Id array to filter results by tags',
    type: [Number],
  })
  @ApiResponse({
    status: 200,
    description: 'The projects were fetched successfully.',
    type: Pagination,
  })
  findByProfileUserId(
    @Request() req,
    @Body() tagIds: number[],
  ): Promise<Pagination<Project>> {
    return this.projectService.findByProfileUserIdPaginated(req.user.userId, {
      limit: req.query.hasOwnProperty('limit') ? req.query.limit : 100,
      page: req.query.hasOwnProperty('page') ? req.query.page : 0,
      query: req.query.hasOwnProperty('query') ? req.query.query : '',
      projectNameOrder: req.query.projectNameOrder,
      createdAtOrder: req.query.createdAtOrder,
      marketTypeOrder: req.query.marketTypeOrder,
      from: req.query.from,
      to: req.query.to,
      tags: tagIds,
      marketType: req.query.marketType,
    });
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Id from project to be fetch',
  })
  @ApiResponse({
    status: 200,
    description:
      'The product backlogs from specified project were fetched successfully.',
    type: Project,
  })
  findOne(@Param('id') id: number) {
    return this.projectService.findOne(+id);
  }

  @Get('/raw-requirements/market-type/:id')
  @ApiParam({ name: 'id', type: 'integer', description: 'Id from market type used to filter projects' })
  @ApiResponse({ status: 200, description: 'The raw requirements from specified market type were fetched successfully.', type: Requirement })
  findRawRequirementsByMarketTypeId(@Param('id') id: number) {
    return this.projectService.findRawRequirementsByMarketTypeId(+id);
  }

  @Get('/cleaned-requirements/market-type/:id')
  @ApiParam({ name: 'id', type: 'integer', description: 'Id from market type used to filter projects' })
  @ApiResponse({ status: 200, description: 'The cleaned requirements from specified market type were fetched successfully.', type: Requirement })
  findCleanedRequirementsByMarketTypeId(@Param('id') id: number) {
    return this.projectService.findCleanedRequirementsByMarketTypeId(+id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Id from project to be updated',
  })
  @ApiBody({
    type: UpdateProjectDto,
    description:
      'This endpoint will receive the fields to be updated and also be able to receive sub objects to upsert with cascade',
  })
  @ApiResponse({
    status: 200,
    description: 'The project was updated successfully.',
  })
  update(@Param('id') id: number, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Id from project to be deleted',
  })
  @ApiResponse({
    status: 204,
    description: 'The project was deleted successfully.',
  })
  remove(@Param('id') id: number) {
    return this.projectService.remove(+id);
  }

  @Post('/excel/:id')
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Id from project to be exported',
  })
  @ApiResponse({
    status: 201,
    description: 'The project was exported successfully.',
    type: [ProjectExcelResponseDto],
  })
  exportToExcel(@Param('id') id: number) {
    return this.excelService.exportProjectById(id);
  }

  @Post('/import')
  @ApiResponse({
    status: 201,
    description: 'The project was exported successfully.',
    type: [ProjectExcelResponseDto],
  })
  @UseInterceptors(
    FileInterceptor('file',multerConfig))
  importProjectFromExcel(@Request() req,@UploadedFile() file: Express.Multer.File) {
    return this.excelService.importProject(req.user.userId,file);
  }

}
