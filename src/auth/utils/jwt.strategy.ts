import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('AUTH_SECRETE'),
        });
    }

    async validate(payload: any) {
        const isAuthNameSucces = this.configService.get<string>('AUTH_NAME') === payload.username
        const isAuthPasswordSucces = this.configService.get<string>('AUTH_PASSWORD') === payload.password

        if (!isAuthNameSucces || !isAuthPasswordSucces) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        return { username: payload.username };
    }
}
