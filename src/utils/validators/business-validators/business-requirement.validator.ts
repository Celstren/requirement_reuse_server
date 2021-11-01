import { HttpException, HttpStatus } from "@nestjs/common";
import { CustomMessages } from "src/exception/custom-messages";
import { Requirement } from "src/requirement/entities/requirement.entity";
import { RequirementService } from "src/requirement/requirement.service";
import { MethodsUtil } from "src/utils/methods.util";
import { ArrayValidator } from "../array.validator";
import { BusinessRequirementPriorityValidator } from "./business-requirement-priority.validator";

export class BusinessRequirementValidator {

    private readonly requirementService: RequirementService;
    private readonly businessRequirementPriorityValidator: BusinessRequirementPriorityValidator;

    constructor(requirementService: RequirementService, businessRequirementPriorityValidator: BusinessRequirementPriorityValidator) {
        this.requirementService = requirementService;
        this.businessRequirementPriorityValidator = businessRequirementPriorityValidator;
    }

    getUniqueKey(requirement: Requirement) : string {
        return requirement.systemDescription + requirement.actorDescription + requirement.actionDescription;
    }

    validateRequirements(requirements: Requirement[]): void {
        if (ArrayValidator.isNotEmpty(requirements)) {
            let mapped = new Map<string, boolean>();
            let duplicated: string[] = [];
            for (const [index, requirement] of MethodsUtil.toEntries<Requirement>(requirements)) {
                this.businessRequirementPriorityValidator.validateRequirementPriorities(requirement?.requirementPriorities);
                let key = this.getUniqueKey(requirement);
                if (mapped[key]) {
                    duplicated.push(index.toString());
                } else {
                    mapped[key] = true;
                }
            }
            if (duplicated.length > 0) {
                throw new HttpException(CustomMessages.DUPLICATED_PRODUCT_BACKLOGS + ' at positions: ' + duplicated.join(', '), HttpStatus.BAD_REQUEST);
            } else if ((requirements?.length ?? 0) < 5) {
                throw new HttpException(CustomMessages.REQUIREMENT_MINIMUM_ERROR, HttpStatus.BAD_REQUEST);
            }
        }
    }

    async validateDelete(id: number): Promise<void> {
        let requirement = await this.requirementService.findOne(id);
        let siblings = await this.requirementService.findByProductBacklogId(requirement.productBacklogId);
        siblings.forEach((value,index)=>{
            if(value.id==id) siblings.splice(index,1);
        });
        this.validateRequirements(siblings);
    }

    async validateUpdatedRequirements(productBacklogId: number, requirements: Requirement[]): Promise<boolean> {
        if (ArrayValidator.isNotEmpty(requirements)) {
            let uniqueKeys: Map<string, number> = new Map<string, number>();
            requirements.forEach(
                requirement => {
                    uniqueKeys[this.getUniqueKey(requirement)] ??= 1;
                }
            );
            let currentRequirements = await this.requirementService.findByProductBacklogId(productBacklogId);
            let duplicated = [];
            currentRequirements.forEach(
                (requirement, index) => {
                    if (uniqueKeys[this.getUniqueKey(requirement)]) {
                        duplicated.push(index.toString());
                    } else {
                        uniqueKeys[this.getUniqueKey(requirement)] = 1;
                    }
                    uniqueKeys[this.getUniqueKey(requirement)]++;
                }
            );
            if (ArrayValidator.isNotEmpty(duplicated)) {
                throw new HttpException(CustomMessages.DUPLICATED_PRODUCT_BACKLOGS + ' at positions: ' + duplicated.join(',') + '. From product backlog id: ' + productBacklogId, HttpStatus.BAD_REQUEST);
            }
            return true;
        }
        return false;
    }
}