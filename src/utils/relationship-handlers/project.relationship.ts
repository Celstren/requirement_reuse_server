import { CreateEmployeeDto } from "src/profile-user/dto/create-employee.dto";
import { UpdateProjectDto } from "src/project/dto/update-project.dto";
import { Project } from "src/project/entities/project.entity";
import { ProjectService } from "src/project/project.service";
import { SessionService } from "src/session/session.service";
import { Tag } from "src/tag/entities/tag.entity";
import { TagService } from "src/tag/tag.service";
import { Repository } from "typeorm";
import { ArrayValidator } from "../validators/array.validator";

export class ProjectRelationship {

  private readonly projectRepository: Repository<Project>;
  private readonly projectService: ProjectService;
  private readonly sessionService: SessionService;
  private readonly tagService: TagService;

  constructor(projectRepository: Repository<Project>, projectService: ProjectService, sessionService: SessionService, tagService: TagService) {
    this.projectRepository = projectRepository;
    this.projectService = projectService;
    this.sessionService = sessionService;
    this.tagService = tagService;
  }

  async addAndCleanRelationships(id: number, tags: Tag[], employees: CreateEmployeeDto[]): Promise<void> {
    if (ArrayValidator.isNotEmpty(tags) || ArrayValidator.isNotEmpty(employees)) {
      let project = await this.projectService.findOne(id);
      let updatePromises = [];
      updatePromises.push(this.addTagsRelationship(project, tags));
      updatePromises.push(this.addEmployeesRelationship(project, employees));
      await Promise.all(updatePromises);
    }
  }

  async addEmployeesRelationship(project: Project, employees: CreateEmployeeDto[]): Promise<void> {
    if (ArrayValidator.isNotEmpty(employees)) {
      let savedEmployees = await this.sessionService.signEmployees(employees);
      await this.projectRepository
        .createQueryBuilder()
        .relation(Project, 'employees')
        .of(project)
        .addAndRemove(savedEmployees, project.employees);
    }
  }

  async addTagsRelationship(project: Project, tags: Tag[]): Promise<void> {
    if (ArrayValidator.isNotEmpty(tags)) {
      let savedTags = await this.tagService.create(tags);
      await this.projectRepository
        .createQueryBuilder()
        .relation(Project, 'tags')
        .of(project)
        .addAndRemove(savedTags, project.tags);
    }
  }

}