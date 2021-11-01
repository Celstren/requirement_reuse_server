import { Test, TestingModule } from '@nestjs/testing';
import { RequirementPriorityService } from './requirement-priority.service';

describe('RequirementPriorityService', () => {
  let service: RequirementPriorityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequirementPriorityService],
    }).compile();

    service = module.get<RequirementPriorityService>(RequirementPriorityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
