import { ProjectPaginationOptions } from "src/pagination/pagination-entities/project-pagination";
import { ArrayValidator } from "src/utils/validators/array.validator";
import { EntityRepository, Repository } from "typeorm";
import { Project } from "./entities/project.entity";

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project>{
    async findAllPaginated(options: ProjectPaginationOptions){
        const query = this.createQueryBuilder('project');
        this.applyPaginationFilters(options, query);
        const found = await query.getMany();
        this.applySortingFilters(options, found);
        return found;
    }
    async findByProfileUserIdPaginated(profileUserId: number,options: ProjectPaginationOptions){
      const query = this.createQueryBuilder('project');
      query.where('project.profile_user_id = :profileUserId', { profileUserId: profileUserId });
      this.applyPaginationFilters(options, query);
      const found = await query.getMany();
      this.applySortingFilters(options, found);
      return found;
  }

  private applySortingFilters(options: ProjectPaginationOptions, found: Project[]) {
    if (options.createdAtOrder) 
      return this.sortByCreateAtOrder(found, options);
    if (options.marketTypeOrder) 
      return this.soryByMarketTypeOrder(found, options);
    if (options.projectNameOrder)
      return this.sortByProjectName(found, options);
    
  }

  private sortByProjectName(found: Project[], options: ProjectPaginationOptions) {
    found.sort((a, b) => {
      if (options.projectNameOrder.toUpperCase() == 'ASC') {
        return a.projectName.localeCompare(b.projectName);
      }
      return b.projectName.localeCompare(a.projectName);
    });
  }

  private soryByMarketTypeOrder(found: Project[], options: ProjectPaginationOptions) {
    found.sort((a, b) => {
      if (options.marketTypeOrder.toUpperCase() == 'ASC') {
        return a.marketType.marketTypeName.localeCompare(b.marketType.marketTypeName);
      }
      return b.marketType.marketTypeName.localeCompare(a.marketType.marketTypeName);
    }); 
  }

  private sortByCreateAtOrder(found: Project[], options: ProjectPaginationOptions) {
    found.sort((a, b) => {
      let aString = a.createdAt.toString();
      let bString = b.createdAt.toString();
      if (options.createdAtOrder.toUpperCase() == 'ASC') {
        return aString.localeCompare(bString);
      }
      return bString.localeCompare(aString);
    });
  }

  private applyPaginationFilters(options: ProjectPaginationOptions, query) {
    query.skip(options.page);
    query.take(options.limit);
    query.andWhere("project.visibility = 'PUBLIC'");
    if (options.query) {
      query.andWhere("project.project_name LIKE :query", { query: '%' + options.query + '%' });
    }
    if (options.from) {
      query.andWhere('project.created_at >= :from AND project.created_at < :to', { from: options.from, to: options.to ?? (new Date().toISOString()) });
    }
    if (ArrayValidator.isNotEmpty(options.tags)) {
      query.leftJoinAndSelect('project.tags', 'tag');
      query.andWhere('tag.id IN(:...idInParam)', { idInParam: options.tags });
    }
    if (options.marketType) {
      query.andWhere('project.market_type_id = :marketType', { marketType: options.marketType });
    }
    query.leftJoin('project.marketType', 'marketType');
    query.select(
          [
            'project.id',
            'project.projectName',
            'project.visibility',
            'marketType',
            'project.createdAt',
            'project.modifiedAt',
          ]
    );
  }

  
  
}