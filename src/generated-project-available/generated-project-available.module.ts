import { Module } from '@nestjs/common';
import { GeneratedProjectAvailableService } from './generated-project-available.service';
import { GeneratedProjectAvailableController } from './generated-project-available.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneratedProjectAvailable } from './entities/generated-project-available.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GeneratedProjectAvailable])],
  controllers: [GeneratedProjectAvailableController],
  providers: [GeneratedProjectAvailableService],
  exports: [GeneratedProjectAvailableService]
})
export class GeneratedProjectAvailableModule {}
