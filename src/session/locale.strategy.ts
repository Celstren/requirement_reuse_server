import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionService } from './session.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private sessionService: SessionService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.sessionService.verifyUser(username, password);
    return user;
  }
}