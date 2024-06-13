import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { SendDataDto } from './send-data.dto';
import { Type } from 'class-transformer';

export class SendMessageWppDto {
  @ApiProperty({ description: 'The message content' })
  @IsString({ message: 'Only string' })
  @IsNotEmpty({ message: 'Message required' })
  message: string;

  @ApiProperty({ type: [SendDataDto] })
  @IsArray({ message: 'Only Array' })
  @IsNotEmpty({ message: 'Send required' })
  @Type(() => SendDataDto)
  send: SendDataDto[];
}
