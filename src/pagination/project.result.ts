import { ApiProperty } from "@nestjs/swagger";
import { ProjectVisibility } from "src/project/entities/project.entity";
import { Tag } from "src/tag/entities/tag.entity";

export class ProjectResult {

    @ApiProperty()
    projectName: string;

    @ApiProperty({ enum: ProjectVisibility })
    visibility: string;

    @ApiProperty()
    marketType: string;

    @ApiProperty({ type: Tag, isArray: true })
    tags: Tag[] = [];

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    modifiedAt: string;

}