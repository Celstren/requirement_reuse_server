import { ApiProperty } from '@nestjs/swagger';
import { PaginationOptionsInterface } from '../pagination.options.interface'

export class ProjectPaginationOptions extends PaginationOptionsInterface {
    @ApiProperty()
    projectNameOrder?: 'ASC' | 'DESC';

    @ApiProperty()
    createdAtOrder?: 'ASC' | 'DESC';

    @ApiProperty()
    marketTypeOrder?: 'ASC' | 'DESC';

    @ApiProperty()
    from?: string;

    @ApiProperty()
    to?: string;

    @ApiProperty()
    tags?: number[];
    
    @ApiProperty()
    marketType?: string;
}