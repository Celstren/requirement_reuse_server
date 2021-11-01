import { ApiProperty } from "@nestjs/swagger";

export class SignDto {

    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;

}