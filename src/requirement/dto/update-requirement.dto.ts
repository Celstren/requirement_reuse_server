import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UpdateRequirementPriorityDto } from 'src/requirement-priority/dto/update-requirement-priority.dto';
import { CreateRequirementDto } from './create-requirement.dto';

export class UpdateRequirementDto extends PartialType(CreateRequirementDto) {

    @ApiProperty()
    id?: number;
    
    @ApiProperty({ type: UpdateRequirementPriorityDto, isArray: true})
    updateRequirementPriorities?: UpdateRequirementPriorityDto[];

}
