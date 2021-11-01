import { Controller, Request, Post, Get, UseGuards, UsePipes, ValidationPipe, Body, UseFilters } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomException } from 'src/exception/custom.exception';
import { ApplicationExceptionFilter } from 'src/exception/typeorm-exception.filter';
import { CreateProfileUserDto } from 'src/profile-user/dto/create-profile-user.dto';
import { ProfileUser } from 'src/profile-user/entities/profile-user.entity';
import { JwtAuthGuard } from './jwt-session.guard';
import { SessionDto } from './dto/session.dto';
import { SessionService } from './session.service';
import { SignDto } from './dto/sign.dto';
import { RefreshSessionDto } from './dto/refresh-session.dto';

@ApiTags('Session')
@Controller('session')
@UseFilters(new ApplicationExceptionFilter())
@ApiResponse({ status: 403, description: 'Forbidden.', type: CustomException })
@ApiResponse({ status: 400, description: 'Error.', type: CustomException })
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}
  
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  @ApiBody({ type: SignDto, description: 'This endpoint will receive data from user to login' })
  @ApiResponse({ status: 201, description: 'The profile user was logged in successfully.' })
  async login(@Body() dto:SignDto) {
    return this.sessionService.login(dto);
  }
  
  @Post('/sign')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBody({ type: CreateProfileUserDto, description: 'This endpoint will receive data from user to be registered in the sistem' })
  @ApiResponse({ status: 201, description: 'The profile user was signed in successfully.', type: ProfileUser })
  sign(@Body() createProfileUserDto: CreateProfileUserDto) {
    return this.sessionService.sign(createProfileUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('/profile')
  @ApiResponse({ status: 200, description: 'The user token was fetched successfully.', type: SessionDto })
  getProfile(@Request() req) {
    return req.user;
  }


  @Post('/refresh')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBody({ type: RefreshSessionDto, description: 'This endpoint will receive access token and refresh token from user to refresh access token' })
  @ApiResponse({ status: 200, description: 'The user token was refreshed successfully.', type: RefreshSessionDto })
  refreshSession(@Body() dto: RefreshSessionDto) {
    return this.sessionService.refreshSession(dto);
  }
}