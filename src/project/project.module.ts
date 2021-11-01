import { forwardRef, Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductBacklogModule } from 'src/product-backlog/product-backlog.module';
import { ProfileUserModule } from 'src/profile-user/profile-user.module';
import { TagModule } from 'src/tag/tag.module';
import { SessionModule } from 'src/session/session.module';
import { RequirementModule } from 'src/requirement/requirement.module';
import { ProjectRepository } from './project.repository';
import { S3ClientModule } from 'src/s3-client/s3-client.module';
import { ProjectExcelService } from './project-excel/project-excel.service';
import { MarketTypeModule } from 'src/market-type/market-type.module';
import { GeneratedProjectAvailableModule } from 'src/generated-project-available/generated-project-available.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectRepository]),
    MarketTypeModule,
    forwardRef(() => ProfileUserModule),
    TagModule,
    ProductBacklogModule,
    RequirementModule,
    S3ClientModule,
    GeneratedProjectAvailableModule,
    forwardRef(() => SessionModule),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectExcelService],
  exports: [ProjectService],
})
export class ProjectModule {}
