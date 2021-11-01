import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ProfileUser } from 'src/profile-user/entities/profile-user.entity';
import { ProfileUserService } from 'src/profile-user/profile-user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateProfileUserDto } from 'src/profile-user/dto/create-profile-user.dto';
import { CreateEmployeeDto } from 'src/profile-user/dto/create-employee.dto';
import { CustomMessages } from 'src/exception/custom-messages';
import { RefreshSessionDto } from './dto/refresh-session.dto';
import { SignDto } from './dto/sign.dto';

@Injectable()
export class SessionService {
    
    static SALT_OR_ROUNDS = 10;

    constructor(
        @Inject(forwardRef(() => ProfileUserService))
        private profileUserService: ProfileUserService,
        private jwtService: JwtService) {}

    async verifyUser(email: string, pass: string): Promise<ProfileUser> {
        const user = await this.profileUserService.findByEmail(email);
        if (!await this.comparePassword(pass,user.password))
            throw new UnauthorizedException(CustomMessages.PASSWORD_INVALID)
        return user;
    }

    async login(dto: SignDto): Promise<any> {
        const user = await this.verifyUser(dto.username,dto.password)
        const payload = {username: user.email, id:user.id}
        const refreshToken = await this.saveRefreshToken(payload, user);
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: refreshToken
        };
    }

    private async saveRefreshToken(payload: { username: string; id: number; }, user: ProfileUser) {
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d'
        });
        await this.profileUserService.update(user.id, { refreshToken });
        return refreshToken;
    }

    async sign(createProfileUserDto: CreateProfileUserDto): Promise<ProfileUser> {
        createProfileUserDto.password = await this.encryptPassword(createProfileUserDto.password);
        return this.profileUserService.create(createProfileUserDto);
    }

    async signEmployees(employees: CreateEmployeeDto[]): Promise<ProfileUser[]> {
        if (employees?.length == 0) return [];
        let notRegisteredEmployees = employees.filter(employee => !employee.id);
        let registeredEmployees = employees.filter(employee => employee.id);
        for (const notRegisteredEmployee of notRegisteredEmployees) {
            notRegisteredEmployee.password = await this.encryptPassword(notRegisteredEmployee.password);
        }
        return this.profileUserService.createEmployees(notRegisteredEmployees.concat(registeredEmployees));
    }

    async encryptPassword(password: string): Promise<string> {
        return await bcrypt.hash(password.toString(), SessionService.SALT_OR_ROUNDS);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    async refreshSession(dto:RefreshSessionDto): Promise<RefreshSessionDto> {
        const payload = this.jwtService.decode(dto.token);
        const user = await this.profileUserService.findOne(parseInt(payload["id"]));
        await this.validateRefreshToken(user,dto.refreshToken);
        return {
            token: this.jwtService.sign({ username: user.email, id: user.id }),
            refreshToken: user.refreshToken
        }

    }

    private async validateRefreshToken(user:ProfileUser,token:string){
        try {
            this.jwtService.verify(token,{secret:process.env.JWT_REFRESH_SECRET})
        } catch (error) {
            throw new UnauthorizedException(CustomMessages.JWT_REFRESH_TOKEN_EXPIRED);
        }
        if(user.refreshToken != token)
            throw new UnauthorizedException(CustomMessages.INVALID_REFRESH_TOKEN);
    }

}
