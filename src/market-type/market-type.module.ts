import { Module } from '@nestjs/common';
import { MarketTypeService } from './market-type.service';
import { MarketTypeController } from './market-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketType } from './entities/market-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MarketType])],
  controllers: [MarketTypeController],
  providers: [MarketTypeService],
  exports:[MarketTypeService]
})
export class MarketTypeModule {}
