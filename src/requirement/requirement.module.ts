import { forwardRef, Module } from '@nestjs/common';
import { RequirementService } from './requirement.service';
import { RequirementController } from './requirement.controller';
import { Requirement } from './entities/requirement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequirementPriorityModule } from 'src/requirement-priority/requirement-priority.module';

@Module({
  imports: [TypeOrmModule.forFeature([Requirement]), RequirementPriorityModule],
  controllers: [RequirementController],
  providers: [RequirementService],
  exports: [RequirementService],
})
export class RequirementModule {}
