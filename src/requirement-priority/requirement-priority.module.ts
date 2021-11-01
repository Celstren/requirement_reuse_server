import { Module } from '@nestjs/common';
import { RequirementPriorityService } from './requirement-priority.service';
import { RequirementPriorityController } from './requirement-priority.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequirementPriority } from './entities/requirement-priority.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequirementPriority])],
  controllers: [RequirementPriorityController],
  providers: [RequirementPriorityService],
  exports: [RequirementPriorityService],
})
export class RequirementPriorityModule {}
