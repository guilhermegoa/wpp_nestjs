import { ApiProperty } from "@nestjs/swagger";

export class SendMessageWppDto {
    @ApiProperty({ description: 'The ID of the client' })
    id: string;

    @ApiProperty({ description: 'The phone number to send the message to' })
    number: string;

    @ApiProperty({ description: 'The message content' })
    message: string;
}