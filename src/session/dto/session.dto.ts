import { ApiProperty } from "@nestjs/swagger";

export class SessionDto {

    @ApiProperty()
    id: number;

    @ApiProperty()
    username: string;

}