import { HttpException, HttpStatus } from "@nestjs/common";
import { CustomMessages } from "src/exception/custom-messages";
import { ProductBacklog } from "src/product-backlog/entities/product-backlog.entity";
import { ProductBacklogService } from "src/product-backlog/product-backlog.service";
import { MethodsUtil } from "src/utils/methods.util";
import { ArrayValidator } from "../array.validator";
import { BusinessRequirementValidator } from "./business-requirement.validator";

export class BusinessProductBacklogValidator {

    private readonly productBacklogService: ProductBacklogService;
    private readonly businessRequirementValidator: BusinessRequirementValidator;

    constructor(productBacklogService: ProductBacklogService, businessRequirementValidator: BusinessRequirementValidator) {
        this.productBacklogService = productBacklogService;
        this.businessRequirementValidator = businessRequirementValidator;
    }

    getUniqueKey(productBacklog: ProductBacklog): string {
        return productBacklog.productBacklogName;
    }

    validateProjectId(productBacklog: ProductBacklog): void {
        if (!productBacklog.projectId) {
            throw new HttpException(CustomMessages.PROJECT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
    }

    validateProductBacklogs(productBacklogs: ProductBacklog[]): void {
        if (ArrayValidator.isNotEmpty(productBacklogs)) {
            let mapped = new Map<string, boolean>();
            let duplicated: string[] = [];
            for (const [index, productBacklog] of MethodsUtil.toEntries<ProductBacklog>(productBacklogs)) {
                this.businessRequirementValidator.validateRequirements(productBacklog?.requirements);
                let key = this.getUniqueKey(productBacklog);
                if (mapped[key]) {
                    duplicated.push(index.toString());
                } else {
                    mapped[key] = true;
                }
            }
            if (duplicated.length > 0) {
                throw new HttpException(CustomMessages.DUPLICATED_PRODUCT_BACKLOGS + ' at positions: ' + duplicated.join(', '), HttpStatus.BAD_REQUEST);
            } else if ((productBacklogs?.length ?? 0) < 1) {
                throw new HttpException(CustomMessages.PRODUCT_BACKLOG_MINIMUM_ERROR, HttpStatus.BAD_REQUEST);
            }
        }
    }

    async validateDelete(id: number): Promise<void> {
        let productBacklog = await this.productBacklogService.findOne(id);
        let siblings = await this.productBacklogService.findByProjectId(productBacklog.projectId);
        siblings.forEach((value,index)=>{
            if(value.id==id) siblings.splice(index,1);
        });
        this.validateProductBacklogs(siblings);
    }

    async validUpdatedProductBacklogs(projectId: number, productBacklogs: ProductBacklog[]): Promise<boolean> {
        if (ArrayValidator.isNotEmpty(productBacklogs)) {
            let uniqueKeys: Map<string, number> = new Map<string, number>();
            productBacklogs.forEach(
                productBacklog => {
                    uniqueKeys[this.getUniqueKey(productBacklog)] ??= 1;
                }
            );
            let currentBacklogs = await this.productBacklogService.findByProjectId(projectId);
            let duplicated = [];
            currentBacklogs.forEach(
                productBacklog => {
                    if (uniqueKeys[this.getUniqueKey(productBacklog)]) {
                        duplicated.push(productBacklog.productBacklogName);
                    } else {
                        uniqueKeys[this.getUniqueKey(productBacklog)] = 1;
                    }
                    uniqueKeys[this.getUniqueKey(productBacklog)]++;
                }
            );
            if (ArrayValidator.isNotEmpty(duplicated)) {
                throw new HttpException(CustomMessages.DUPLICATED_PRODUCT_BACKLOGS + ' with ids: ' + duplicated.join(','), HttpStatus.BAD_REQUEST);
            }
            return true;
        }
        return false;
    }
}