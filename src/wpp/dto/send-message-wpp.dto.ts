import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SendMessageWppDto {
    @ApiProperty({ description: 'The ID of the client' })
    @IsString({ message: 'Only string' })
    @IsNotEmpty({ message: 'Id required' })
    id: string;

    @ApiProperty({ description: 'The phone number to send the message to' })
    @IsString({ message: 'Only string' })
    @IsNotEmpty({ message: 'Number required' })
    number: string;

    @ApiProperty({ description: 'The message content' })
    @IsString({ message: 'Only string' })
    @IsNotEmpty({ message: 'Message required' })
    message: string;
}