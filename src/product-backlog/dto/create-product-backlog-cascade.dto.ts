import { ApiProperty } from "@nestjs/swagger";
import { classToPlain } from "class-transformer";
import { IsNotEmpty, MaxLength } from "class-validator";
import { CreateRequirementCascadeDto } from "src/requirement/dto/create-requirement-cascade.dto";

export class CreateProductBacklogCascadeDto {

    @IsNotEmpty()
    @MaxLength(100)
    @ApiProperty()
    productBacklogName: string;

    @ApiProperty()
    projectId: number;

    @ApiProperty({ type: CreateRequirementCascadeDto, isArray: true})
    requirements: CreateRequirementCascadeDto[] = [];

    toJSON() {
        return classToPlain(this);
    }
}