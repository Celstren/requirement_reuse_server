import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UpdateProductBacklogDto } from 'src/product-backlog/dto/update-product-backlog.dto';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {

    @ApiProperty()
    id?: number;

    @ApiProperty()
    updateProductBacklogs?: UpdateProductBacklogDto[];

}
