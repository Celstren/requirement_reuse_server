import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class RefreshSessionDto{
    @IsNotEmpty()
    @ApiProperty()
    token: string

    @IsNotEmpty()
    @ApiProperty()
    refreshToken: string
}