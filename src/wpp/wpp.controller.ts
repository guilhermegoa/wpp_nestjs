import { Controller, Post, Body, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { WppService } from './wpp.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SendMessageWppDto } from './dto/send-message-wpp.dto';
import { StartWppDto } from './dto/start-wpp.dto';
import { JwtAuthGuard } from 'src/auth/utils/jwt-auth.guard';

@ApiTags('wpp')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wpp')
export class WppController {
  constructor(private readonly wppService: WppService) { }

  @Post('start')
  @ApiOperation({ summary: 'Start client' })
  @ApiResponse({ status: 200, description: 'The client has been successfully start.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async startClient(@Body() body: StartWppDto) {
    await this.wppService.startClient(body.id);
    return { success: true };
  }

  @Post('sendMessage')
  @ApiOperation({ summary: 'Send a message' })
  @ApiResponse({ status: 200, description: 'The message has been successfully sent.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async sendMessage(@Body() body: SendMessageWppDto) {
    await this.wppService.sendMessage(body.id, body.number, body.message);
    return { success: true };
  }

  @Delete('destroy/:id')
  async destroyClient(@Request() req, @Param('id') id: string) {
    await this.wppService.destroyClient(id);
    return { success: true };
  }
}
