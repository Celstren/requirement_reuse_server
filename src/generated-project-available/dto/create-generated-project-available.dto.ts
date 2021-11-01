import { ApiProperty } from "@nestjs/swagger";
import { classToPlain } from "class-transformer";
import { IsNotEmpty, IsInt, MaxLength } from "class-validator";

export class CreateGeneratedProjectAvailableDto {

    @IsNotEmpty()
    @MaxLength(250)
    @ApiProperty()
    requirements_url: string;

    @IsInt()
    @ApiProperty()
    marketTypeId: number;

    toJSON() {
        return classToPlain(this);
    }

}