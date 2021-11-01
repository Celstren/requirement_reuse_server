import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Requirement } from 'src/requirement/entities/requirement.entity';
import { BusinessRequirementPriorityValidator } from 'src/utils/validators/business-validators/business-requirement-priority.validator';
import { Repository } from 'typeorm';
import { CreateRequirementPriorityCascadeDto } from './dto/create-requirement-priority-cascade.dto';
import { CreateRequirementPriorityDto } from './dto/create-requirement-priority.dto';
import { UpdateRequirementPriorityDto } from './dto/update-requirement-priority.dto';
import { RequirementPriority } from './entities/requirement-priority.entity';

@Injectable()
export class RequirementPriorityService {

  private readonly businessRequirementPriorityValidator: BusinessRequirementPriorityValidator;

  constructor(
    @InjectRepository(RequirementPriority)
    private requirementPriorityRepository: Repository<RequirementPriority>,
  ) {
    this.businessRequirementPriorityValidator = new BusinessRequirementPriorityValidator();
  }

  async create(createRequirementPriorityDto: CreateRequirementPriorityDto[]): Promise<RequirementPriority[]> {
    let mappedPriorities = plainToClass<RequirementPriority, CreateRequirementPriorityDto>(RequirementPriority, createRequirementPriorityDto);
    this.businessRequirementPriorityValidator.validateRequirementPriorities(mappedPriorities);
    return this.requirementPriorityRepository.save(createRequirementPriorityDto);
  }

  async createCascade(createRequirementPriorityDto: CreateRequirementPriorityCascadeDto, requirement: Requirement): Promise<RequirementPriority> {
    createRequirementPriorityDto.requirementId = requirement.id;
    return await this.requirementPriorityRepository.save(createRequirementPriorityDto);
  }

  async createMultipleCascade(createRequirementPrioritiesDto: CreateRequirementPriorityCascadeDto[], requirement: Requirement): Promise<RequirementPriority[]> {
    let mappedPriorities = plainToClass<RequirementPriority, CreateRequirementPriorityCascadeDto>(RequirementPriority, createRequirementPrioritiesDto);
    this.businessRequirementPriorityValidator.validateRequirementPriorities(mappedPriorities);
    let requirementPrioritiesPromises: Promise<RequirementPriority>[] = [];
    createRequirementPrioritiesDto?.forEach(
      createRequirementPriorityCascadeDto => {
        requirementPrioritiesPromises.push(this.createCascade(createRequirementPriorityCascadeDto, requirement));
      }
    );
    return await Promise.all(requirementPrioritiesPromises);
  }

  async updateMultiple(requirementId: number, updateRequirementPrioritiesDto: UpdateRequirementPriorityDto[]): Promise<void> {
    let mapped = plainToClass<RequirementPriority, UpdateRequirementPriorityDto>(RequirementPriority, updateRequirementPrioritiesDto);
    let isValid = await this.businessRequirementPriorityValidator.validUpdatedRequirementPriorities(requirementId, mapped);
    if (isValid) {
      await this.requirementPriorityRepository.save(updateRequirementPrioritiesDto);
    }
  }

  async remove(ids: number[]): Promise<void> {
    await this.requirementPriorityRepository.delete(ids);
  }
}
