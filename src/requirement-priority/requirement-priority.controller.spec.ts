import { Test, TestingModule } from '@nestjs/testing';
import { RequirementPriorityController } from './requirement-priority.controller';
import { RequirementPriorityService } from './requirement-priority.service';

describe('RequirementPriorityController', () => {
  let controller: RequirementPriorityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequirementPriorityController],
      providers: [RequirementPriorityService],
    }).compile();

    controller = module.get<RequirementPriorityController>(RequirementPriorityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
