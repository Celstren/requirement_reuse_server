import { forwardRef, Module } from '@nestjs/common';
import { ProfileUserService } from './profile-user.service';
import { ProfileUserController } from './profile-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileUser } from './entities/profile-user.entity';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfileUser]),
    forwardRef(() => ProjectModule),
  ],
  controllers: [ProfileUserController],
  providers: [ProfileUserService],
  exports: [ProfileUserService],
})
export class ProfileUserModule { }
