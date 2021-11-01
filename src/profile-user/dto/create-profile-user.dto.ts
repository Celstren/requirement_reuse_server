import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsHash, IsLocale, IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";
import { CustomMessages } from "src/exception/custom-messages";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/;

export class CreateProfileUserDto {

    @IsNotEmpty()
    @MaxLength(50)
    @ApiProperty()
    firstName: string;

    @IsNotEmpty()
    @MaxLength(50)
    @ApiProperty()
    lastName: string;

    @IsEmail()
    @MaxLength(100)
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(8)
    @Matches(passwordRegex,{ message: CustomMessages.PASSWORD_INVALID })
    @ApiProperty()
    password: string;

    @ApiProperty({ default: '' })
    primaryAddress: string = '';

    @ApiProperty({ default: '' })
    secundaryAddress: string = '';

    @IsLocale()
    @MaxLength(20)
    @ApiProperty({ default: 'es-pe' })
    locationCode: string = 'es-pe';

    @IsNotEmpty()
    @MaxLength(20)
    @ApiProperty({ default: 'Spanish (Peru)' })
    locationDescription: string = 'Spanish (Peru)';

    @IsBoolean()
    @ApiProperty({ default: false })
    suscribed: boolean = false;
}
