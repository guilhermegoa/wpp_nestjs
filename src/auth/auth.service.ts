import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private configService: ConfigService) {
    }

    async token(username: string, password: string) {
        const payload = { username, password };

        const isAuthNameSucces = this.configService.get<string>('AUTH_NAME') === username
        const isAuthPasswordSucces = this.configService.get<string>('AUTH_PASSWORD') === password

        if (!isAuthNameSucces || !isAuthPasswordSucces) {
            throw new HttpException('Data is wrong.', HttpStatus.BAD_REQUEST);
        }

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
