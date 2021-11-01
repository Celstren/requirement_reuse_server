import { ApiProperty } from "@nestjs/swagger";
import { classToPlain } from "class-transformer";
import { IsInt, IsNotEmpty, MaxLength } from "class-validator";

export class CreateRequirementPriorityDto {

    @IsNotEmpty()
    @MaxLength(50)
    @ApiProperty()
    priorityValue: string;

    @IsNotEmpty()
    @MaxLength(30)
    @ApiProperty()
    priorityType: string;

    @IsInt()
    @ApiProperty()
    profileUserId: number;

    @IsInt()
    @ApiProperty()
    requirementId: number;

    toJSON() {
        return classToPlain(this);
    }

}
