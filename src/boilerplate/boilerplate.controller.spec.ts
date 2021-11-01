import { Test, TestingModule } from '@nestjs/testing';
import { BoilerplateController } from './boilerplate.controller';
import { BoilerplateService } from './boilerplate.service';

describe('BoilerplateController', () => {
  let controller: BoilerplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoilerplateController],
      providers: [BoilerplateService],
    }).compile();

    controller = module.get<BoilerplateController>(BoilerplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
