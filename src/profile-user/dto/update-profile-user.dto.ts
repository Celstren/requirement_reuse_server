import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProfileUserDto } from './create-profile-user.dto';

export class UpdateProfileUserDto extends PartialType(CreateProfileUserDto) {
    @ApiProperty({ default: '' })
    refreshToken:string
}
