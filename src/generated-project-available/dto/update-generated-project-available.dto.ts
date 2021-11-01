import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateGeneratedProjectAvailableDto } from './create-generated-project-available.dto';

export class UpdateGeneratedProjectAvailableDto extends PartialType(CreateGeneratedProjectAvailableDto) {
}
