import { Body, Controller, Get, Post, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomException } from 'src/exception/custom.exception';
import { ApplicationExceptionFilter } from 'src/exception/typeorm-exception.filter';
import { JwtAuthGuard } from 'src/session/jwt-session.guard';
import { CreateMarketTypeDto } from './dto/create-market-type.dto';
import { MarketType } from './entities/market-type.entity';
import { MarketTypeService } from './market-type.service';

@ApiTags('Market Type')
@Controller('market-type')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiResponse({ status: 403, description: 'Forbidden.', type: CustomException })
@ApiResponse({ status: 400, description: 'Error.', type: CustomException })
export class MarketTypeController {
  constructor(private readonly marketTypeService: MarketTypeService) {}

  @Post()
  @UseFilters(new ApplicationExceptionFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBody({ type: CreateMarketTypeDto })
  @ApiResponse({ status: 201, description: 'The market type was created successfully.', type: MarketType })
  create(@Body() createMarketTypeDto: CreateMarketTypeDto) {
    return this.marketTypeService.create(createMarketTypeDto);
  }

  
  @Get()
  @UseFilters(new ApplicationExceptionFilter())
  @ApiResponse({ status: 200, description: 'The list of market type fetched.', type: [MarketType] })
  findAll() {
    return this.marketTypeService.findAll();
  }
}
