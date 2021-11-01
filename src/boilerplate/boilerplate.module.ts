import { Module } from '@nestjs/common';
import { BoilerplateService } from './boilerplate.service';
import { BoilerplateController } from './boilerplate.controller';
import { Boilerplate } from './entities/boilerplate.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  imports: [TypeOrmModule.forFeature([Boilerplate])],
  controllers: [BoilerplateController],
  providers: [BoilerplateService]
})
export class BoilerplateModule {}
