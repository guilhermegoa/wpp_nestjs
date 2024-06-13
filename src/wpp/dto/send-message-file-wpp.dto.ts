import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { SendMessageWppDto } from './send-message-wpp.dto';
import { SendFileDataDto } from './send-file-data.dto';

export class SendMessageFileWppDto extends SendMessageWppDto {
    @ApiProperty()
    @IsObject({ message: 'Only Object' })
    @IsNotEmpty({ message: 'Send required' })
    file: SendFileDataDto;
}


