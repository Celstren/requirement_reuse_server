import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UsePipes, ValidationPipe, UseGuards, UseFilters } from '@nestjs/common';
import { ProfileUserService } from './profile-user.service';
import { CreateProfileUserDto } from './dto/create-profile-user.dto';
import { UpdateProfileUserDto } from './dto/update-profile-user.dto';
import { JwtAuthGuard } from 'src/session/jwt-session.guard';
import { ApplicationExceptionFilter } from 'src/exception/typeorm-exception.filter';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomException } from 'src/exception/custom.exception';
import { ProfileUser } from './entities/profile-user.entity';
import { Project } from 'src/project/entities/project.entity';

@ApiTags('Profile User')
@Controller('profile-user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiResponse({ status: 403, description: 'Forbidden.', type: CustomException })
@ApiResponse({ status: 400, description: 'Error.', type: CustomException })
export class ProfileUserController {
  constructor(private readonly profileUserService: ProfileUserService) {}

  @Post()
  @UseFilters(new ApplicationExceptionFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBody({ type: [CreateProfileUserDto], description: 'This endpoint will receive a profile user' })
  @ApiResponse({ status: 201, description: 'The profile user backlogs were created successfully.', type: ProfileUser })
  create(@Body() createProfileUserDto: CreateProfileUserDto) {
    return this.profileUserService.create(createProfileUserDto);
  }

  @Post('/validate-suscription')
  @UseFilters(new ApplicationExceptionFilter())
  @ApiResponse({ status: 201, description: 'The profile user backlogs were created successfully.', type: Boolean })
  @ApiOperation({ description: 'This endpoint will receive the profile id from token to validate if is suscribed' })
  validateSuscription(@Request() req) {
    return this.profileUserService.validateSuscription(req.user.userId);
  }

  @Post('/validate-projects')
  @UseFilters(new ApplicationExceptionFilter())
  @ApiResponse({ status: 201, description: 'The profile user backlogs were created successfully.', type: Boolean })
  @ApiOperation({ description: 'This endpoint will receive the profile id from token to validate if has projects published' })
  validateProjects(@Request() req) {
    return this.profileUserService.validateProjects(req.user.userId);
  }

  @Get()
  @UseFilters(new ApplicationExceptionFilter())
  @ApiResponse({ status: 200, description: 'The profile users were fetched successfully.', type: [ProfileUser] })
  @ApiResponse({ status: 403, description: 'Forbidden.', type: CustomException })
  @ApiResponse({ status: 400, description: 'Error.', type: CustomException })
  findAll() {
    return this.profileUserService.findAll();
  }

  @Get('/favorite-projects')
  @UseFilters(new ApplicationExceptionFilter())
  @ApiResponse({ status: 200, description: 'The favorite projects from user were fetched successfully.', type: [Project] })
  findFavoriteProjects(@Request() req) {
    return this.profileUserService.findFavoriteProjects(req.user.userId);
  }

  @Post('/favorite-project/:id')
  @UseFilters(new ApplicationExceptionFilter())
  @ApiParam({ name: 'id', type: 'integer', description: 'Id from favorite project to add' })
  @ApiResponse({ status: 200, description: 'The favorite project was added successfully.' })
  addFavoriteProject(@Request() req, @Param('id') projectId: number) {
    return this.profileUserService.addFavoriteProject(req.user.userId, projectId);
  }

  @Delete('/favorite-project/:id')
  @UseFilters(new ApplicationExceptionFilter())
  @ApiParam({ name: 'id', type: 'integer', description: 'Id from favorite project to remove' })
  @ApiResponse({ status: 201, description: 'The favorite project was removed successfully.' })
  removeFavoriteProject(@Request() req, @Param('id') projectId: number) {
    return this.profileUserService.removeFavoriteProject(req.user.userId, projectId);
  }

  @Get(':id')
  @UseFilters(new ApplicationExceptionFilter())
  @ApiParam({ name: 'id', type: 'integer', description: 'Id from profile user to fetch' })
  @ApiResponse({ status: 200, description: 'The profile user was fetched successfully.' })
  findOne(@Param('id') id: string) {
    return this.profileUserService.findOne(+id);
  }

  @Patch(':id')
  @UseFilters(new ApplicationExceptionFilter())
  @ApiParam({ name: 'id', type: 'integer', description: 'Id from profile user to be updated' })
  @ApiBody({ type: UpdateProfileUserDto, description: 'This endpoint will receive the required fields to be updated from profile user specified'  })
  update(@Param('id') id: string, @Body() updateProfileUserDto: UpdateProfileUserDto) {
    return this.profileUserService.update(+id, updateProfileUserDto);
  }

  @Delete(':id')
  @UseFilters(new ApplicationExceptionFilter())
  @ApiParam({ name: 'id', type: 'integer', description: 'Id from profile user to be deleted' })
  @ApiResponse({ status: 204, description: 'The profile user was deleted successfully.' })
  remove(@Param('id') id: string) {
    return this.profileUserService.remove(+id);
  }
}
