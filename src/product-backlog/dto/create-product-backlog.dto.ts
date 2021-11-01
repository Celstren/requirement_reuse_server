import { ApiProperty } from "@nestjs/swagger";
import { classToPlain } from "class-transformer";
import { IsInt, IsNotEmpty, MaxLength } from "class-validator";
import { Requirement } from "src/requirement/entities/requirement.entity";

export class CreateProductBacklogDto {

    @IsNotEmpty()
    @MaxLength(100)
    @ApiProperty()
    productBacklogName: string;

    @IsInt()
    @ApiProperty()
    projectId: number;

    @ApiProperty({ type: Requirement, isArray: true })
    requirements: Requirement[] = [];

    toJSON() {
        return classToPlain(this);
    }
}