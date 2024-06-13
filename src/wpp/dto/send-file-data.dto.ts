import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendFileDataDto {
  @ApiProperty({ description: 'File type, like "@files/xxxx | image/xxxx"' })
  @IsString({ message: 'Only string' })
  @IsString({ message: 'Only string' })
  @IsNotEmpty({ message: 'File name required' })
  type: string;

  @ApiProperty({ description: 'Name of file' })
  @IsString({ message: 'Only string' })
  @IsNotEmpty({ message: 'File name required' })
  name: string;

  @ApiProperty({ description: 'File base64 in string' })
  @IsString({ message: 'Only string' })
  @IsNotEmpty({ message: 'File base64 required' })
  data: string;
}
