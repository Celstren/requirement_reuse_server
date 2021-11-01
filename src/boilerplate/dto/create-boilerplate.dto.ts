import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, IsInt } from "class-validator";

export class CreateBoilerplateDto {

    @IsNotEmpty()
    @MaxLength(100)
    @ApiProperty({
        description: 'The verb of the boilerplate',
        default: 'run',
      })
    verb: string;

    @IsNotEmpty()
    @MaxLength(100)
    @ApiProperty({
        description: 'The object of the boilerplate',
        default: 'program',
      })
    object: string;

    @IsNotEmpty()
    @MaxLength(300)
    @ApiProperty({
        description: 'The detail of the boilerplate',
        default: 'other software',
      })
    detail: string;

    @IsInt()
    @ApiProperty()
    requirementId: number;

    @IsInt()
    @ApiProperty()
    marketTypeId: number;

}
