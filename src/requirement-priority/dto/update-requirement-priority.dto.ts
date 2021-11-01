import { PartialType } from '@nestjs/swagger';
import { CreateRequirementPriorityDto } from './create-requirement-priority.dto';

export class UpdateRequirementPriorityDto extends PartialType(CreateRequirementPriorityDto) {}
