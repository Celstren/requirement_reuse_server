import { ApiProperty } from '@nestjs/swagger';
import { PaginationResultInterface } from './pagination.results.interface';
import { ProjectResult } from './project.result';

export class Pagination<PaginationEntity> {
  @ApiProperty({ type: ProjectResult, isArray: true })
  public results: PaginationEntity[];

  @ApiProperty()
  public page_total: number;
  
  @ApiProperty()
  public total: number;

  constructor(paginationResults: PaginationResultInterface<PaginationEntity>) {
    this.results = paginationResults.results;
    this.page_total = paginationResults.results.length;
    this.total = paginationResults.total;
  }
}