import { ApiProperty } from '@nestjs/swagger';

export class ProjectExcelResponseDto {
  @ApiProperty()
  url: string;
}
