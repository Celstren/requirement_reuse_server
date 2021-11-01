import { ApiProperty } from "@nestjs/swagger";
import { classToPlain } from "class-transformer";
import { IsBoolean, IsEmail, IsLocale, IsNotEmpty, MaxLength } from "class-validator";

export class CreateEmployeeDto {

    @ApiProperty()
    id: number;

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
    
    @ApiProperty({ default: Math.random().toString(36).slice(-8) })
    password: string = Math.random().toString(36).slice(-8);

    @ApiProperty({ default: '' })
    primaryAddress: string = '';

    @ApiProperty({ default: '' })
    secundaryAddress: string = '';

    @IsLocale()
    @MaxLength(20)
    @ApiProperty()
    @ApiProperty({ default: 'es-pe' })
    locationCode: string = 'es-pe';

    @IsNotEmpty()
    @MaxLength(20)
    @ApiProperty({ default: 'Spanish (Peru)' })
    locationDescription: string = 'Spanish (Peru)';

    @IsBoolean()
    @ApiProperty({ default: false })
    suscribed: boolean = false;

    toJSON() {
        return classToPlain(this);
    }
}
