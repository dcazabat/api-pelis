import { Roles } from './../common/decorators/roles.decorator';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersRepository.findOne({ where: { username } });
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async loginWithCredentials(username: string, password: string) {
        const user = await this.validateUser(username, password);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        return this.login(user);
    }

    async login(user: any) {
        // En el Payload le agregamos los campos necesarios en el Token
        const payload = { username: user.username, id: user.id, roles: user.roles };

        const accessToken = this.jwtService.sign(payload, { expiresIn: '30m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.usersRepository.update(user.id, { refreshToken: hashedRefreshToken });

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    async refreshToken(userId: number, refreshToken: string) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user || !user.refreshToken) {
            throw new Error('Invalid User ');
        }

        const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isMatch) {
            throw new Error('Invalid refresh token');
        }

        const payload = { username: user.username, id: user.id, roles: user.roles };
        const newAccessToken = this.jwtService.sign(payload);
        return {
            access_token: newAccessToken,
        };
    }

    async logout(userId: number) {
        await this.usersRepository.update(userId, { refreshToken: null });
        return { message: 'Logout successful' };
    }
}
