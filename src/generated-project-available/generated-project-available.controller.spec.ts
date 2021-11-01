import { Test, TestingModule } from '@nestjs/testing';
import { GeneratedProjectAvailableController } from './generated-project-available.controller';
import { GeneratedProjectAvailableService } from './generated-project-available.service';

describe('GeneratedProjectAvailableController', () => {
  let controller: GeneratedProjectAvailableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneratedProjectAvailableController],
      providers: [GeneratedProjectAvailableService],
    }).compile();

    controller = module.get<GeneratedProjectAvailableController>(GeneratedProjectAvailableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
