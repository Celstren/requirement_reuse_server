import { Test, TestingModule } from '@nestjs/testing';
import { BoilerplateService } from './boilerplate.service';

describe('BoilerplateService', () => {
  let service: BoilerplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoilerplateService],
    }).compile();

    service = module.get<BoilerplateService>(BoilerplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
