import { BadRequestException } from "@nestjs/common";
import { ExcelWrapper } from "src/excel-service/excel.wrapper";
import { CustomMessages } from "src/exception/custom-messages";
import { MarketTypeService } from "src/market-type/market-type.service";
import { CreateProductBacklogCascadeDto } from "src/product-backlog/dto/create-product-backlog-cascade.dto";
import { CreateRequirementPriorityCascadeDto } from "src/requirement-priority/dto/create-requirement-priority-cascade.dto";
import { CreateRequirementCascadeDto } from "src/requirement/dto/create-requirement-cascade.dto";
import { CreateProjectDto } from "../dto/create-project.dto";

export class ProjectExcelParser {
    readonly projects: CreateProjectDto[];
    readonly excel:ExcelWrapper
    readonly ownerId:number;
    private _productBacklogs = new Map<number,CreateProductBacklogCascadeDto>();

    constructor(ownerId:number,excel:ExcelWrapper,private marketTypeService:MarketTypeService){
        this.ownerId = ownerId;
        this.excel = excel;
        this.projects = [];
    }

    async getProject(){
        this.parseBacklogs();
        this.parseRequirements();
        await this.parseProject();
        return this.projects;
    }

    private async parseProject(){
        this.workbook.getWorksheet('PROJECT').eachRow((row, i) => {
            if (i.valueOf() < 3) return;
            const project = new CreateProjectDto();
            project.projectName = row.getCell('B').value.toString();
            const marketTypeId = parseInt(row.getCell('C').value.toString());
            project.marketTypeId = marketTypeId;
            this.projects.push(project);
        });
        const backlogs = this._productBacklogs.values();
        let idx = 0;
        for (const backlog of this._productBacklogs.values()) {
            this.projects[idx++].productBacklogs.push(backlog);
        }
    }

    private parseBacklogs(){
        this.workbook.getWorksheet('PRODUCT BACKLOG').eachRow((row,i)=>{
            if (i.valueOf() < 3) return;
            const backlog = new CreateProductBacklogCascadeDto();
            const backlogId = parseInt(row.getCell('A').value.toString());
            backlog.productBacklogName = row.getCell('B').value.toString();
            backlog.requirements = [] 
            this._productBacklogs.set(backlogId, backlog);
        })
        
    }

    private parseRequirements(){
        this.workbook.getWorksheet('REQUIREMENT').eachRow((row,i)=>{
            if (i.valueOf() < 3) return;
            const requirement = new CreateRequirementCascadeDto();
            const requirementPriority = new CreateRequirementPriorityCascadeDto();
            requirement.systemDescription = row.getCell('B').value.toString();
            requirement.actorDescription = row.getCell('C').value.toString();
            requirement.actionDescription = row.getCell('D').value.toString();
            requirement.requirementType = row.getCell('E').value.toString();
            requirementPriority.priorityValue = row.getCell('F').value.toString();
            requirementPriority.priorityType = row.getCell('G').value.toString();
            const backlogId = row.getCell('H').value
            if (!backlogId) throw new BadRequestException(CustomMessages.PRODUCT_BACKLOG_ID_MISSING)
            requirementPriority.profileUserId = this.ownerId;
            requirement.requirementPriorities.push(requirementPriority);
            const productBacklog = this._productBacklogs.get(parseInt(backlogId.valueOf().toString()))
            if (!productBacklog) throw new BadRequestException(CustomMessages.PRODUCT_BACKLOG_NOT_FOUND)
            productBacklog.requirements.push(requirement);
        })
        
    }
    get workbook(){
        return this.excel.workBook;
    }

    validateMarketType(name:string){
        return this.marketTypeService.findOneByNameOrFail(name);
    }

}