import { ApiProperty } from "@nestjs/swagger";
import { classToPlain } from "class-transformer";
import { IsNotEmpty, IsEnum, IsInt, IsArray, MaxLength } from "class-validator";
import { CreateEmployeeDto } from "src/profile-user/dto/create-employee.dto";
import { CreateRequirementDto } from "src/requirement/dto/create-requirement.dto";
import { Tag } from "src/tag/entities/tag.entity";
import { ProjectVisibility } from "../entities/project.entity";

export class CreateProjectRequirementDto {

    @IsNotEmpty()
    @MaxLength(50)
    @ApiProperty()
    projectName: string;

    @IsEnum(ProjectVisibility)
    @ApiProperty({ enum: ProjectVisibility })
    visibility: string = ProjectVisibility.PUBLIC;

    @ApiProperty()
    profileUserId: number;

    @IsInt()
    @ApiProperty()
    marketTypeId: number;

    @ApiProperty()
    referenceId: number;

    @IsArray()
    @ApiProperty()
    tags: Tag[] = [];

    @IsArray()
    @ApiProperty({ type: CreateEmployeeDto, isArray: true})
    employees: CreateEmployeeDto[] = [];

    @ApiProperty()
    @ApiProperty({ type: CreateRequirementDto, isArray: true})
    requirements: CreateRequirementDto[] = [];

    toJSON() {
        return classToPlain(this);
    }

}