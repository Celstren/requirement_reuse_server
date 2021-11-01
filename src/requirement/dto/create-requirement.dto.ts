import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { classToPlain } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, MaxLength } from "class-validator";
import { RequirementPriority } from "src/requirement-priority/entities/requirement-priority.entity";
import { RequirementType } from "../entities/requirement.entity";

export class CreateRequirementDto {

    @IsNotEmpty()
    @MaxLength(50)
    @ApiProperty()
    systemDescription: string;

    @IsNotEmpty()
    @MaxLength(30)
    @ApiProperty()
    actorDescription: string;

    @IsNotEmpty()
    @MaxLength(500)
    @ApiProperty()
    actionDescription: string;

    @MaxLength(500)
    @ApiProperty()
    cleanActionDescription: string = '';

    @MaxLength(500)
    @ApiProperty()
    detailsDescription: string = '';

    @IsEnum(RequirementType)
    @ApiProperty({ enum: RequirementType })
    requirementType: string;

    @IsInt()
    @ApiProperty()
    productBacklogId: number;

    @ApiProperty()
    referenceId?: number;

    @ApiProperty({ type: RequirementPriority, isArray: true})
    requirementPriorities: RequirementPriority[] = [];

    toJSON() {
        return classToPlain(this);
    }

}