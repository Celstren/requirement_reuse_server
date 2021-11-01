import { Module } from '@nestjs/common';
import { ProductBacklogService } from './product-backlog.service';
import { ProductBacklogController } from './product-backlog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductBacklog } from './entities/product-backlog.entity';
import { RequirementModule } from 'src/requirement/requirement.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductBacklog]), RequirementModule],
  controllers: [ProductBacklogController],
  providers: [ProductBacklogService],
  exports: [ProductBacklogService],
})
export class ProductBacklogModule {}
