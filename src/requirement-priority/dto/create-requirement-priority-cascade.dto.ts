import { ApiProperty } from "@nestjs/swagger";
import { classToPlain } from "class-transformer";
import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateRequirementPriorityCascadeDto {

    @IsNotEmpty()
    @MaxLength(50)
    @ApiProperty()
    priorityValue: string;

    @IsNotEmpty()
    @MaxLength(30)
    @ApiProperty()
    priorityType: string;

    @ApiProperty()
    profileUserId: number;

    @ApiProperty()
    requirementId: number;

    toJSON() {
        return classToPlain(this);
    }

}
