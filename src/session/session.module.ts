import { forwardRef, Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { ProfileUserService } from 'src/profile-user/profile-user.service';
import { ProfileUserModule } from 'src/profile-user/profile-user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './locale.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    forwardRef(() => ProfileUserModule), 
    PassportModule, 
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory: async (config:ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }
      }),
      inject:[ConfigService]
    })],
  controllers: [SessionController],
  providers: [SessionService, LocalStrategy, JwtStrategy],
  exports: [SessionService],
})
export class SessionModule {}
