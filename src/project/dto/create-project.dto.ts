import { ApiProperty } from "@nestjs/swagger";
import { classToPlain } from "class-transformer";
import { IsNotEmpty, IsEnum, IsInt, IsArray, MaxLength } from "class-validator";
import { CreateProductBacklogCascadeDto } from "src/product-backlog/dto/create-product-backlog-cascade.dto";
import { CreateEmployeeDto } from "src/profile-user/dto/create-employee.dto";
import { Tag } from "src/tag/entities/tag.entity";
import { ProjectVisibility } from "../entities/project.entity";

export class CreateProjectDto {

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

    @IsArray()
    @ApiProperty()
    tags: Tag[] = [];

    @IsArray()
    @ApiProperty({ type: CreateEmployeeDto, isArray: true})
    employees: CreateEmployeeDto[] = [];

    @ApiProperty({ type: CreateProductBacklogCascadeDto, isArray: true})
    productBacklogs: CreateProductBacklogCascadeDto[] = [];

    toJSON() {
        return classToPlain(this);
    }

}