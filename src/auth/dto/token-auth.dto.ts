import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class TokenAuthDto {
    @ApiProperty({ description: 'User name to login' })
    @IsString({ message: 'Only string' })
    @IsNotEmpty({ message: 'UserName required' })
    username: string;

    @ApiProperty({ description: 'Password to login' })
    @IsString({ message: 'Only string' })
    @IsNotEmpty({ message: 'Password required' })
    password: string;

    @ApiProperty({ description: 'Password to login' })
    @IsString({ message: 'Only string' })
    @IsNotEmpty({ message: 'Phone number required' })
    phone: string;
}