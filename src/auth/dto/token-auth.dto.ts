import { ApiProperty } from "@nestjs/swagger";

export class TokenAuthDto {
    @ApiProperty({ description: 'User name to login' })
    username: string;

    @ApiProperty({ description: 'Password to login' })
    password: string;
}