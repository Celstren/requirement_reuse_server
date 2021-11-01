import { Test, TestingModule } from '@nestjs/testing';
import { MarketTypeController } from './market-type.controller';
import { MarketTypeService } from './market-type.service';

describe('MarketTypeController', () => {
  let controller: MarketTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketTypeController],
      providers: [MarketTypeService],
    }).compile();

    controller = module.get<MarketTypeController>(MarketTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
