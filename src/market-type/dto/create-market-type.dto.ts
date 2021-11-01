import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateMarketTypeDto {

    @IsNotEmpty()
    @MaxLength(100)
    @ApiProperty({
        description: 'The name of the market type',
        default: 'Ecommerce',
      })
    marketTypeName: string;

}