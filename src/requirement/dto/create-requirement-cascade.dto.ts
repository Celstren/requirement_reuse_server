import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { classToPlain } from "class-transformer";
import { IsEnum, IsNotEmpty, MaxLength } from "class-validator";
import { CreateRequirementPriorityCascadeDto } from "src/requirement-priority/dto/create-requirement-priority-cascade.dto";
import { RequirementType } from "../entities/requirement.entity";

export class CreateRequirementCascadeDto {

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
    @ApiProperty()
    requirementType: string;

    @ApiProperty()
    productBacklogId: number;

    @ApiProperty({ type: CreateRequirementPriorityCascadeDto, isArray: true})
    requirementPriorities: CreateRequirementPriorityCascadeDto[] = [];

    toJSON() {
        return classToPlain(this);
    }

}