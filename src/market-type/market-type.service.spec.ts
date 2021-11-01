import { Test, TestingModule } from '@nestjs/testing';
import { MarketTypeService } from './market-type.service';

describe('MarketTypeService', () => {
  let service: MarketTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketTypeService],
    }).compile();

    service = module.get<MarketTypeService>(MarketTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
