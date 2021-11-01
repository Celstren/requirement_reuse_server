import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileUserModule } from './profile-user/profile-user.module';
import { SessionModule } from './session/session.module';
import { ProjectModule } from './project/project.module';
import { MarketTypeModule } from './market-type/market-type.module';
import { TagModule } from './tag/tag.module';
import { ProductBacklogModule } from './product-backlog/product-backlog.module';
import { RequirementModule } from './requirement/requirement.module';
import { RequirementPriorityModule } from './requirement-priority/requirement-priority.module';
import { ConfigModule } from '@nestjs/config';
import { S3ClientModule } from './s3-client/s3-client.module';

import { GeneratedProjectAvailableModule } from './generated-project-available/generated-project-available.module';
import { BoilerplateModule } from './boilerplate/boilerplate.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: false
    }),
    ProfileUserModule,
    SessionModule,
    ProjectModule,
    MarketTypeModule,
    TagModule,
    ProductBacklogModule,
    RequirementModule,
    RequirementPriorityModule,
    S3ClientModule,
    GeneratedProjectAvailableModule,
    BoilerplateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
