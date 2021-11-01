import { Test, TestingModule } from '@nestjs/testing';
import { GeneratedProjectAvailableService } from './generated-project-available.service';

describe('GeneratedProjectAvailableService', () => {
  let service: GeneratedProjectAvailableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneratedProjectAvailableService],
    }).compile();

    service = module.get<GeneratedProjectAvailableService>(GeneratedProjectAvailableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
