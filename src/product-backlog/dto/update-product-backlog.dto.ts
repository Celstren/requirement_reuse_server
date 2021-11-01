import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UpdateRequirementDto } from 'src/requirement/dto/update-requirement.dto';
import { CreateProductBacklogDto } from './create-product-backlog.dto';

export class UpdateProductBacklogDto extends PartialType(CreateProductBacklogDto) {

    @ApiProperty()
    id: number;
    
    @ApiProperty({ type: UpdateRequirementDto, isArray: true})
    updateRequirements: UpdateRequirementDto[];

}
