import { NotFoundException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ExcelWrapper } from 'src/excel-service/excel.wrapper';
import { CustomMessages } from 'src/exception/custom-messages';
import { S3ClientService } from 'src/s3-client/s3-client.service';
import { Project } from '../entities/project.entity';
import { ProjectExcelParser } from './project-excel.parser';
import { ProjectService } from '../project.service';
import { MarketTypeService } from 'src/market-type/market-type.service';
import { Worksheet } from 'exceljs';

@Injectable()
export class ProjectExcelService {
  constructor(
    private projectService: ProjectService,
    private marketTypeService: MarketTypeService,
    private s3: S3ClientService,
  ) {}

  async exportProjectById(id: number) {
    const project = await this.projectService.findOne(id);
    const excel = await this.generateExcel(project);
    const uploaded = await this.s3.uploadFile({
      body: excel.data,
      contentType: excel.mimetype,
      fileName: excel.name,
    });
    return {
      url: uploaded.Location,
    };
  }

  async importProject(ownerId:number,file: Express.Multer.File){
    const workbook = await ExcelWrapper.load(file.originalname,file.buffer)
    const projects = await new ProjectExcelParser(ownerId,workbook,this.marketTypeService)
    .getProject();

    return await this.projectService.createMultiple(ownerId,projects);
  }

  private async generateExcel(project: Project) {
    const workbook = ExcelWrapper.build(project.projectName);
    this.addProject(workbook, project);
    this.addBacklogs(project, workbook);
    this.addRequirements(project, workbook);
    return await workbook.getExcel();
  }

  private addRequirements(project: Project, workbook: ExcelWrapper) {
    const ownerId = project.profileUserId;
    const flattenRequirements = project.productBacklogs
      .map((x) => x.requirements)
      .reduce((acc, v) => acc.concat(v), []);
    const requirements = flattenRequirements.reduce((acc, v) => {
      const priorities = v.requirementPriorities.filter(x => x.profileUserId === ownerId);
      if (!priorities.length)
        throw new InternalServerErrorException(CustomMessages.INVALID_PROJECT_TO_BE_EXPORTED);
      return acc.concat([
        {
          ...v,
          priority: priorities[0].priorityValue,
          priorityType: priorities[0].priorityType
        }
      ]);
    }, []);
    workbook.addWorkSheet({
      rows: requirements,
      columns: [
        { header: 'ID', key: 'id' },
        { header: 'SYSTEM', key: 'systemDescription' },
        { header: 'ACTOR', key: 'actorDescription' },
        { header: 'ACTION', key: 'actionDescription' },
        {header:'TYPE',key:'requirementType'},
        {header:'PRIORITY',key:'priority'},
        {header:'PRIORITY TYPE',key:'priorityType'},
        {header:'PRODUCT BACKLOG ID',key:'productBacklogId'}
      ],
      name: 'REQUIREMENT',
      titleRange:'A1:H1'
    });
  }

  private addBacklogs(project: Project, workbook: ExcelWrapper) {
    const backlogs = project.productBacklogs.map((x) => ({
      id: x.id.toString(),
      name: x.productBacklogName,
      project_id: project.id.toString(),
    }));
    workbook.addWorkSheet({
      rows: backlogs,
      columns: [
        { header: 'ID', key: 'id' },
        { header: 'NAME', key: 'name' },
        { header: 'PROJECT ID', key: 'project_id' },
      ],
      name: 'PRODUCT BACKLOG',
      titleRange:'A1:C1'
    });
  }

  private addProject(workbook: ExcelWrapper, project: Project) {
    workbook.addWorkSheet({
      rows: [{ id: project.id.toString(), name: project.projectName, marketType:project.marketType.marketTypeName }],
      columns: [
        { header: 'ID', key: 'id' },
        { header: 'NAME', key: 'name' },
        {header:'MARKET_TYPE',key:'marketType'}
      ],
      name: 'PROJECT',
      titleRange:'A1:C1'
    });
  } 

  
}
