import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { CustomMessages } from 'src/exception/custom-messages';
import { RequirementService } from 'src/requirement/requirement.service';
import { BusinessProductBacklogValidator } from 'src/utils/validators/business-validators/business-product-backlog.validator';
import { BusinessRequirementPriorityValidator } from 'src/utils/validators/business-validators/business-requirement-priority.validator';
import { CommonValidator } from 'src/utils/validators/common.validator';
import { ArrayValidator, BusinessRequirementValidator, QueryValidator } from 'src/utils/validators/validator.index';
import { Repository } from 'typeorm';
import { CreateProductBacklogCascadeDto } from './dto/create-product-backlog-cascade.dto';
import { CreateProductBacklogDto } from './dto/create-product-backlog.dto';
import { UpdateProductBacklogDto } from './dto/update-product-backlog.dto';
import { ProductBacklog } from './entities/product-backlog.entity';

@Injectable()
export class ProductBacklogService {

  private readonly businessProductBacklogValidator: BusinessProductBacklogValidator;

  constructor(
    @InjectRepository(ProductBacklog)
    private productBacklogRepository: Repository<ProductBacklog>,
    private requirementService: RequirementService,
  ) {
    let businessRequirementPriorityValidator = new BusinessRequirementPriorityValidator();
    let businessRequirementValidator = new BusinessRequirementValidator(requirementService, businessRequirementPriorityValidator);
    this.businessProductBacklogValidator = new BusinessProductBacklogValidator(this, businessRequirementValidator);
  }

  async create(createProductBacklogsDto: CreateProductBacklogDto[]): Promise<ProductBacklog[]>  {
    let mappedBacklogs = plainToClass<ProductBacklog, CreateProductBacklogDto>(ProductBacklog, createProductBacklogsDto);
    this.businessProductBacklogValidator.validateProductBacklogs(mappedBacklogs);
    let needCascade = ArrayValidator.isNotEmpty(createProductBacklogsDto?.filter(backlog => ArrayValidator.isNotEmpty(backlog?.requirements)));
    if (needCascade) {
      let mappedBacklogs = plainToClass<CreateProductBacklogCascadeDto, CreateProductBacklogDto>(CreateProductBacklogDto, createProductBacklogsDto);
      let createdBacklogs = await this.createMultipleCascade(mappedBacklogs);
      return createdBacklogs;
    }
    return this.productBacklogRepository.save(createProductBacklogsDto);
  }

  async createCascade(createBacklogCascadeDto: CreateProductBacklogCascadeDto, projectId?: number): Promise<ProductBacklog>  {
    createBacklogCascadeDto.projectId ??= projectId;
    CommonValidator.validateObjectFound(createBacklogCascadeDto.projectId, CustomMessages.PROJECT_ID_MISSING);
    const {
      ['requirements']: requirementsExtracted,
      ...cleanCreateBacklogCascadeDto } = createBacklogCascadeDto;
    let createdBacklog = await this.productBacklogRepository.save(cleanCreateBacklogCascadeDto);
    if (ArrayValidator.isNotEmpty(requirementsExtracted)) {
      createdBacklog.requirements = await this.requirementService.createMultipleCascade(requirementsExtracted, createdBacklog?.id, true);
    }
    return createdBacklog;
  }

  async createMultipleCascade(createBacklogsCascadeDto: CreateProductBacklogCascadeDto[], projectId?: number): Promise<ProductBacklog[]>  {
    let backlogPromises: Promise<ProductBacklog>[] = [];
    createBacklogsCascadeDto?.forEach(
      createBacklogCascadeDto => {
        backlogPromises.push(this.createCascade(createBacklogCascadeDto, projectId));
      }
    );
    return await Promise.all(backlogPromises);
  }

  async findOne(id: number): Promise<ProductBacklog> {
    let productBacklog = await this.productBacklogRepository.findOne(id);
    return CommonValidator.validateObjectFound<ProductBacklog>(productBacklog, CustomMessages.PRODUCT_BACKLOG_NOT_FOUND);
  }

  findAll(): Promise<ProductBacklog[]> {
    return this.productBacklogRepository.find({
      select: [
        'productBacklogName',
        'createdAt',
        'modifiedAt',
      ],
    });
  }

  findByProjectId(id: number): Promise<ProductBacklog[]> {
    return this.productBacklogRepository.find({
      select: [
        'productBacklogName',
        'createdAt',
        'modifiedAt',
      ],
      where: {
        projectId: id,
      }
    });
  }

  async update(id: number, updateProductBacklogDto: UpdateProductBacklogDto): Promise<void> {
    CommonValidator.validateNotNull(id);
    CommonValidator.validateNotNull(updateProductBacklogDto);
    let updateResponse = await this.productBacklogRepository.update(id, updateProductBacklogDto);
    QueryValidator.validateUpdatedRaws(updateResponse, CustomMessages.PRODUCT_BACKLOG_NOT_FOUND);
  }

  async updateMultiple(projectId: number, updateProductBacklogsDto: UpdateProductBacklogDto[]): Promise<void> {
    let mapped = plainToClass<ProductBacklog, UpdateProductBacklogDto>(ProductBacklog, updateProductBacklogsDto);
    let isValid = await this.businessProductBacklogValidator.validUpdatedProductBacklogs(projectId, mapped);
    if (isValid) {
      let requirementPromises = [];
      updateProductBacklogsDto.forEach(
        updateProductBacklogDto => {
          requirementPromises.push(this.requirementService.updateMultiple(updateProductBacklogDto.id, updateProductBacklogDto.updateRequirements));
        }
      );
      await Promise.all(requirementPromises);
      await this.productBacklogRepository.save(updateProductBacklogsDto);
    }
  }

  async remove(id: number): Promise<void> {
    await this.businessProductBacklogValidator.validateDelete(id);
    let deleteResponse = await this.productBacklogRepository.delete(id);
    QueryValidator.validateDeletedRaws(deleteResponse, CustomMessages.PRODUCT_BACKLOG_NOT_FOUND);
  }
}
