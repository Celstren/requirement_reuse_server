import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { CustomMessages } from 'src/exception/custom-messages';
import { GeneratedProjectAvailableService } from 'src/generated-project-available/generated-project-available.service';
import { ProjectPaginationOptions } from 'src/pagination/pagination-entities/project-pagination';
import { CreateProductBacklogCascadeDto } from 'src/product-backlog/dto/create-product-backlog-cascade.dto';
import { ProductBacklogService } from 'src/product-backlog/product-backlog.service';
import { ProfileUserService } from 'src/profile-user/profile-user.service';
import { CreateRequirementCascadeDto } from 'src/requirement/dto/create-requirement-cascade.dto';
import { Requirement, RequirementType } from 'src/requirement/entities/requirement.entity';
import { RequirementService } from 'src/requirement/requirement.service';
import { SessionService } from 'src/session/session.service';
import { TagService } from 'src/tag/tag.service';
import { ProjectRelationship } from 'src/utils/relationship-handlers/relationship.index';
import { BusinessProductBacklogValidator } from 'src/utils/validators/business-validators/business-product-backlog.validator';
import { BusinessRequirementPriorityValidator } from 'src/utils/validators/business-validators/business-requirement-priority.validator';
import { CommonValidator } from 'src/utils/validators/common.validator';
import { ArrayValidator, BusinessProfileUserValidator, BusinessProjectValidator, BusinessRequirementValidator, QueryValidator } from 'src/utils/validators/validator.index';
import { Pagination } from '../pagination/pagination';
import { CreateProjectRequirementDto } from './dto/create-project-requirement.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { ProjectRepository } from './project.repository';
var request = require('request');

@Injectable()
export class ProjectService {

  private readonly businessProjectValidator: BusinessProjectValidator;
  private readonly businessProfileUserValidator: BusinessProfileUserValidator;
  private readonly projectRelationship: ProjectRelationship;

  constructor(
    @InjectRepository(ProjectRepository)
    private projectRepository: ProjectRepository,
    @Inject(forwardRef(() => ProfileUserService))
    private profileUserService: ProfileUserService,
    private tagService: TagService,
    private productBacklogService: ProductBacklogService,
    private requirementService: RequirementService,
    private generatedProjectAvailableService: GeneratedProjectAvailableService,
    @Inject(forwardRef(() => SessionService))
    private sessionService: SessionService,
  ) {
    let businessRequirementPriorityValidator = new BusinessRequirementPriorityValidator();
    let businessRequirementValidator = new BusinessRequirementValidator(this.requirementService, businessRequirementPriorityValidator);
    let businessProductBacklogValidator = new BusinessProductBacklogValidator(this.productBacklogService, businessRequirementValidator);
    this.businessProjectValidator = new BusinessProjectValidator(this, this.profileUserService, this.businessProfileUserValidator, businessProductBacklogValidator);
    this.businessProfileUserValidator = new BusinessProfileUserValidator(this.profileUserService);
    this.projectRelationship = new ProjectRelationship(this.projectRepository, this, this.sessionService, this.tagService);
  }

  async create(profileUserId: number, createProjectDto: CreateProjectDto): Promise<Project> {
      createProjectDto.profileUserId = profileUserId;
      console.log(createProjectDto);
      const {
        ['employees']: employeesExtracted,
        ['productBacklogs']: productBacklogsExtracted,
        ...cleanCreateProjectDto } = createProjectDto;
      let projectCreated = await this.projectRepository.save(cleanCreateProjectDto);
      projectCreated.productBacklogs = await this.productBacklogService.createMultipleCascade(productBacklogsExtracted, projectCreated?.id);
      return projectCreated;
  }

  async createMultiple(profileUserId: number, createProjectsDto: CreateProjectDto[]): Promise<Project[]> {
    const result = [];
    for (const createProjectDto of createProjectsDto) {
      const p = await this.create(profileUserId, createProjectDto);
      result.push(p);
    }
    return result;
}

  async createFromRequirements(profileUserId: number, marketTypeId: number, createdProjects: CreateProjectRequirementDto[]): Promise<Project[]> {
    CommonValidator.validateNotNull(profileUserId);
    CommonValidator.validateNotNull(marketTypeId);
    if (ArrayValidator.isNotEmpty(createdProjects)) {
      const projects: CreateProjectDto[] = [];
      createdProjects.map(
        createdProject => {
          const productBacklog: CreateProductBacklogCascadeDto = new CreateProductBacklogCascadeDto();
          productBacklog.productBacklogName = 'Product Backlog';
          productBacklog.requirements = createdProject.requirements;
          const project: CreateProjectDto = new CreateProjectDto();
          project.marketTypeId = marketTypeId;
          project.profileUserId = profileUserId;
          project.productBacklogs = [productBacklog];
          projects.push(project);
        }
      );
      return await this.projectRepository.save(projects);
    }
    return [];
  }

  async findAllPaginated(options: ProjectPaginationOptions): Promise<Pagination<Project>> {
    const results = await this.projectRepository.findAllPaginated(options);
    return new Pagination<Project>({ results, total: results.length });
  }

  async findOne(id: number): Promise<Project> {
    let project = await this.projectRepository.findOne(id);
    return CommonValidator.validateObjectFound<Project>(project, CustomMessages.PROJECT_NOT_FOUND);
  }

  async findRawRequirementsByMarketTypeId(marketTypeId: number): Promise<Requirement[]> {
    const requirements: Requirement[] = [];
    const projects = await this.projectRepository.find({
      where: { marketTypeId: marketTypeId }
    });
    projects?.forEach(project => {
      project?.productBacklogs?.forEach(productBacklog => {
        requirements.push(...((productBacklog?.requirements ?? [])
        .filter(requirement => 
          (requirement?.cleanActionDescription == null || (requirement?.cleanActionDescription?.length == 0))
          && (requirement?.actionDescription?.length >= 5))));
      });
    });
    return requirements;
  }

  async findCleanedRequirementsByMarketTypeId(marketTypeId: number): Promise<Requirement[]> {
    const requirements: Requirement[] = [];
    const projects = await this.projectRepository.find({
      where: { marketTypeId: marketTypeId }
    });
    projects?.forEach(project => {
      project?.productBacklogs?.forEach(productBacklog => {
        requirements.push(...((productBacklog?.requirements ?? [])
        .filter(requirement => requirement?.cleanActionDescription?.length > 0)));
      });
    });
    return requirements;
  }

  findByProfileUserId(id: number): Promise<Project[]> {
    return this.projectRepository.find({
      select: [
        'projectName',
        'visibility',
        'marketType',
        'tags',
        'createdAt',
        'modifiedAt',
      ],
      where: { profileUserId: id }
    });
  }

  async findByProfileUserIdPaginated(profileUserId: number, options: ProjectPaginationOptions): Promise<Pagination<Project>> {
    const results = await this.projectRepository.findByProfileUserIdPaginated(profileUserId,options);
    return new Pagination<Project>({ results, total:results.length});
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<void> {
    CommonValidator.validateNotNull(id);
    CommonValidator.validateNotNull(updateProjectDto);
    await this.findOne(id);
    await this.businessProjectValidator.validateProject(updateProjectDto.profileUserId, plainToClass(Project, updateProjectDto));
    await this.businessProfileUserValidator.validateUpdatedEmployees(updateProjectDto.profileUserId, plainToClass(Project, updateProjectDto));
    const {
      ['tags']: tagsExtracted,
      ['employees']: employeesExtracted,
      ['updateProductBacklogs']: productBacklogsExtracted,
      ...cleanUpdateProjectDto } = updateProjectDto;
    let updateResponse = await this.projectRepository.update(id, cleanUpdateProjectDto);
    await this.projectRelationship.addAndCleanRelationships(id, tagsExtracted, employeesExtracted);
    await this.productBacklogService.updateMultiple(id, productBacklogsExtracted);
    QueryValidator.validateUpdatedRaws(updateResponse, CustomMessages.PROJECT_NOT_FOUND);
  }

  async remove(id: number): Promise<void> {
    let deleteResponse = await this.projectRepository.delete(id);
    QueryValidator.validateDeletedRaws(deleteResponse, CustomMessages.PROJECT_NOT_FOUND);
  }

  findOneByAttributes({name}){
    return this.projectRepository.findOne({projectName:name});}
}