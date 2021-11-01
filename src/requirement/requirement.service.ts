import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { CustomMessages } from 'src/exception/custom-messages';
import { ProfileUserService } from 'src/profile-user/profile-user.service';
import { RequirementPriorityService } from 'src/requirement-priority/requirement-priority.service';
import { BusinessRequirementPriorityValidator } from 'src/utils/validators/business-validators/business-requirement-priority.validator';
import { CommonValidator } from 'src/utils/validators/common.validator';
import { ArrayValidator, BusinessRequirementValidator, QueryValidator } from 'src/utils/validators/validator.index';
import { In, Repository } from 'typeorm';
import { CreateRequirementCascadeDto } from './dto/create-requirement-cascade.dto';
import { CreateRequirementDto } from './dto/create-requirement.dto';
import { UpdateRequirementDto } from './dto/update-requirement.dto';
import { Requirement } from './entities/requirement.entity';

@Injectable()
export class RequirementService {

  private readonly businessRequirementValidator: BusinessRequirementValidator;

  constructor(
    @InjectRepository(Requirement)
    private requirementRepository: Repository<Requirement>,
    private requirementPriorityService: RequirementPriorityService,
  ) {
    let businessRequirementPriorityValidator = new BusinessRequirementPriorityValidator();
    this.businessRequirementValidator = new BusinessRequirementValidator(this, businessRequirementPriorityValidator);
  }

  async create(createRequirementsDto: CreateRequirementDto[]): Promise<Requirement[]>  {
    let needCascade = ArrayValidator.isNotEmpty(createRequirementsDto?.filter(requirement => (ArrayValidator.isNotEmpty(requirement?.requirementPriorities))));
    await this.updatePopularity(createRequirementsDto);
    if (needCascade) {
      let mappedRequirements = plainToClass<CreateRequirementCascadeDto, CreateRequirementDto>(CreateRequirementCascadeDto, createRequirementsDto);
      return await this.createMultipleCascade(mappedRequirements);
    }
    return this.requirementRepository.save(createRequirementsDto);
  }

  async updatePopularity(createRequirementsDto: CreateRequirementDto[]) {
    if (ArrayValidator.isNotEmpty(createRequirementsDto)) {
      const references = createRequirementsDto
      .filter(createRequirement => createRequirement.referenceId)
      .map(createRequirement => createRequirement.referenceId);
      if (ArrayValidator.isNotEmpty(references)) {
        const referencedRequirements = await this.requirementRepository.find({
          where: { id: In(references) } 
        });
        if (ArrayValidator.isNotEmpty(referencedRequirements)) {
          referencedRequirements.forEach(
            referencedRequirement => {
              referencedRequirement.popularity++;
            }
          );
          await this.requirementRepository.save(referencedRequirements);
        }
      }
    }
  }

  async createCascade(createRequirementCascadeDto: CreateRequirementCascadeDto, productBacklogId?: number): Promise<Requirement>  {
    const { 
      ['requirementPriorities']: requirementPrioritiesExtracted,
      ...cleanCreateRequirementCascadeDto } = createRequirementCascadeDto;
    cleanCreateRequirementCascadeDto.productBacklogId ??= productBacklogId;
    CommonValidator.validateObjectFound(cleanCreateRequirementCascadeDto.productBacklogId, CustomMessages.PRODUCT_BACKLOG_ID_MISSING);
    let createdRequirement = await this.requirementRepository.save(cleanCreateRequirementCascadeDto);
    createdRequirement.requirementPriorities = await this.requirementPriorityService.createMultipleCascade(requirementPrioritiesExtracted, createdRequirement);
    return createdRequirement;
  }

  async createMultipleCascade(createRequirementsCascadeDto: CreateRequirementCascadeDto[], productBacklogId?: number, validate: boolean = false): Promise<Requirement[]>  {
    let requirementPromises: Promise<Requirement>[] = [];
    createRequirementsCascadeDto?.forEach(
      createRequirementCascadeDto => {
        requirementPromises.push(this.createCascade(createRequirementCascadeDto, productBacklogId));
      }
    );
    return await Promise.all(requirementPromises);
  }

  async findOne(id: number): Promise<Requirement> {
    let requirement = await this.requirementRepository.findOne(id);
    return CommonValidator.validateObjectFound<Requirement>(requirement, CustomMessages.REQUIREMENT_NOT_FOUND);
  }

  findAll(): Promise<Requirement[]> {
    return this.requirementRepository.find();
  }

  findByProductBacklogId(productBacklogId: number): Promise<Requirement[]> {
    return this.requirementRepository.find({
      where: {
        productBacklogId: productBacklogId,
      }
    });
  }

  async update(id: number, updateRequirementDto: UpdateRequirementDto): Promise<void> {
    CommonValidator.validateNotNull(id);
    CommonValidator.validateNotNull(updateRequirementDto);
    let updateResponse = await this.requirementRepository.update(id, updateRequirementDto);
    QueryValidator.validateUpdatedRaws(updateResponse, CustomMessages.REQUIREMENT_NOT_FOUND);
  }

  async updateMultiple(productBacklogId: number, updateRequirementsDto: UpdateRequirementDto[]): Promise<void> {
    let mapped = plainToClass<Requirement, UpdateRequirementDto>(Requirement, updateRequirementsDto);
    let isValid = await this.businessRequirementValidator.validateUpdatedRequirements(productBacklogId, mapped);
    if (isValid) {
      let requirementPriorityPromises = [];
      updateRequirementsDto.forEach(
        updateRequirementDto => {
          requirementPriorityPromises.push(this.requirementPriorityService.updateMultiple(updateRequirementDto.id, updateRequirementDto.requirementPriorities));
        }
      );
      await Promise.all(requirementPriorityPromises);
      this.requirementRepository.save(updateRequirementsDto);
    }
  }

  async updateSave(createRequirementsDto: CreateRequirementDto[]): Promise<Requirement[]>  {
    return await this.requirementRepository.save(createRequirementsDto);
  }

  async remove(id: number): Promise<void> {
    await this.businessRequirementValidator.validateDelete(id);
    let deleteResponse = await this.requirementRepository.delete(id);
    QueryValidator.validateDeletedRaws(deleteResponse, CustomMessages.REQUIREMENT_NOT_FOUND);
  }
}
