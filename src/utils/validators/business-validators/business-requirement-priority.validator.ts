import { HttpException, HttpStatus } from "@nestjs/common";
import { CustomMessages } from "src/exception/custom-messages";
import { RequirementPriority } from "src/requirement-priority/entities/requirement-priority.entity";
import { ArrayValidator } from "../array.validator";
import { CommonValidator } from "../common.validator";
import {createConnection, Connection} from "typeorm";

export class BusinessRequirementPriorityValidator {

    getUniqueKey(requirementPriority: RequirementPriority): string { 
        return requirementPriority.profileUserId.toString() + requirementPriority.priorityValue + requirementPriority.priorityType;
    }

    validateRequirementPriorities(requirementPriorities: RequirementPriority[]): void {
        if (ArrayValidator.isNotEmpty(requirementPriorities)) {
            let mapped = new Map<string, boolean>();
            let duplicated: string[] = [];
            requirementPriorities?.forEach((requirementPriority: RequirementPriority, index: number) => {
                CommonValidator.validateObjectFound(requirementPriority?.profileUserId, CustomMessages.UNDEFINED_PROFILE_USER_REQUIREMENT_PRIORITY + ': ' + index.toString());
                let key = this.getUniqueKey(requirementPriority);
                if (mapped[key]) {
                    duplicated.push(index.toString());
                } else {
                    mapped[key] = true;
                }
            });
            if (duplicated.length > 0) {
                throw new HttpException(CustomMessages.DUPLICATED_REQUIREMENT_PRIORITY + ' at positions: ' + duplicated.join(', '), HttpStatus.BAD_REQUEST);
            }
        }
    }

    async validUpdatedRequirementPriorities(requirementId: number, requirementPriorities: RequirementPriority[]): Promise<boolean> {
        if (ArrayValidator.isNotEmpty(requirementPriorities)) {
            let uniqueKeys: Map<string, number> = new Map<string, number>();
            requirementPriorities.forEach(
                requirementPriority => {
                    uniqueKeys[this.getUniqueKey(requirementPriority)] ??= 1;
                }
            );
            const connection: Connection = await createConnection();
            let currentRequirementPriorities = await connection.getRepository(RequirementPriority).find({
                where: {
                    requirementId: requirementId,
                }
            });
            let duplicated = [];
            currentRequirementPriorities.forEach(
                (requirementPriority, index) => {
                    if (uniqueKeys[this.getUniqueKey(requirementPriority)]) {
                        duplicated.push(index.toString());
                    } else {
                        uniqueKeys[this.getUniqueKey(requirementPriority)] = 1;
                    }
                    uniqueKeys[this.getUniqueKey(requirementPriority)]++;
                }
            );
            if (ArrayValidator.isNotEmpty(duplicated)) {
                throw new HttpException(CustomMessages.DUPLICATED_REQUIREMENT_PRIORITY + ' at positions: ' + duplicated.join(','), HttpStatus.BAD_REQUEST);
            }
            return true;
        }
        return false;
    }

}