import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomMessages } from 'src/exception/custom-messages';
import { CommonValidator } from 'src/utils/validators/common.validator';
import { QueryValidator } from 'src/utils/validators/query.validator';
import { Repository } from 'typeorm';
import { CreateGeneratedProjectAvailableDto } from './dto/create-generated-project-available.dto';
import { UpdateGeneratedProjectAvailableDto } from './dto/update-generated-project-available.dto';
import { GeneratedProjectAvailable } from './entities/generated-project-available.entity';

@Injectable()
export class GeneratedProjectAvailableService {

  constructor(
    @InjectRepository(GeneratedProjectAvailable)
    private generatedProjectAvailableRepository: Repository<GeneratedProjectAvailable>,
  ) {}

  create(createGeneratedProjectAvailableDto: CreateGeneratedProjectAvailableDto) {
    return this.generatedProjectAvailableRepository.save(createGeneratedProjectAvailableDto);
  }

  async findAll(): Promise<GeneratedProjectAvailable[]> {
    let generatedProjects = await this.generatedProjectAvailableRepository.find();
    return generatedProjects;
  }

  async findOne(id: number): Promise<GeneratedProjectAvailable> {
    let generatedProject = await this.generatedProjectAvailableRepository.findOne(id);
    return CommonValidator.validateObjectFound<GeneratedProjectAvailable>(generatedProject, CustomMessages.GENERATED_PROJECT_AVAILABLE_NOT_FOUND);
  }

  async findByMarketId(marketTypeId: number): Promise<GeneratedProjectAvailable> {
    let generatedProject = await this.generatedProjectAvailableRepository.findOne({
      where: {
        marketTypeId: marketTypeId,
      }
    });
    return CommonValidator.validateObjectFound<GeneratedProjectAvailable>(generatedProject, CustomMessages.GENERATED_PROJECT_AVAILABLE_NOT_FOUND);
  }

  async update(id: number, updateGeneratedProjectAvailableDto: UpdateGeneratedProjectAvailableDto): Promise<void> {
    CommonValidator.validateNotNull(id);
    CommonValidator.validateNotNull(updateGeneratedProjectAvailableDto);
    let updateResponse = await this.generatedProjectAvailableRepository.update(id, updateGeneratedProjectAvailableDto);
    QueryValidator.validateUpdatedRaws(updateResponse, CustomMessages.GENERATED_PROJECT_AVAILABLE_NOT_FOUND);
  }

  async remove(id: number): Promise<void> {
    let deleteResponse = await this.generatedProjectAvailableRepository.delete(id);
    QueryValidator.validateDeletedRaws(deleteResponse, CustomMessages.GENERATED_PROJECT_AVAILABLE_NOT_FOUND);
  }
}
