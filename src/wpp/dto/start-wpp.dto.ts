import { ApiProperty } from "@nestjs/swagger";

export class StartWppDto {
    @ApiProperty({ description: 'The ID of the client' })
    id: string;
}
