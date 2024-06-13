import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty } from "class-validator";

export class SendDataDto {
    @ApiProperty({ description: 'Phone to send message' })
    @IsArray({ message: 'Only Array' })
    @IsNotEmpty({ message: 'Send required' })
    to: string;

    @ApiProperty({ description: 'Array with params if necessary' })
    @IsArray({ message: 'Only Array' })
    params: string[];
}