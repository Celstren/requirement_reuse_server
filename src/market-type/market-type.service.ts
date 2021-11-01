import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomMessages } from 'src/exception/custom-messages';
import { Repository } from 'typeorm';
import { CreateMarketTypeDto } from './dto/create-market-type.dto';
import { MarketType } from './entities/market-type.entity';
import { CommonValidator } from 'src/utils/validators/common.validator';

@Injectable()
export class MarketTypeService {

  constructor(
    @InjectRepository(MarketType)
    private tagRepository: Repository<MarketType>,
  ) {}

  async create(createMarketTypeDto: CreateMarketTypeDto): Promise<MarketType> {
    return this.tagRepository.save(createMarketTypeDto);
  }

  findAll(): Promise<MarketType[]> {
    return this.tagRepository.find();
  }

  async findOneOrFail(id:number){
    const marketType = await this.tagRepository.findOne(id);
    return CommonValidator.validateObjectFound<MarketType>(marketType, CustomMessages.MARKET_TYPE_NOT_FOUND);
  }

  async findOneByNameOrFail(name:string){
    const marketType = await this.tagRepository.findOne({marketTypeName:name.trim()})
    return CommonValidator.validateObjectFound<MarketType>(marketType, CustomMessages.MARKET_TYPE_NOT_FOUND);
  }

}
