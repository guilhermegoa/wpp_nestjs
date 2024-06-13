import { Controller, Post, Body, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { WppService } from './wpp.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SendMessageWppDto } from './dto/send-message-wpp.dto';
import { JwtAuthGuard } from 'src/auth/utils/jwt-auth.guard';
import { BaseResponse, buildSuccessResponse } from 'src/utils/functions/responses.function';

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
  async startClient(@Request() req): Promise<BaseResponse> {
    await this.wppService.startClient(req.user.phone);
    return buildSuccessResponse(true, 'The client has been successfully start.');
  }

  @Post('sendMessage')
  @ApiOperation({ summary: 'Send a message' })
  @ApiResponse({ status: 200, description: 'The message has been successfully sent.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async sendMessage(@Body() body: SendMessageWppDto): Promise<BaseResponse> {
    await this.wppService.sendMessage(body.id, body.number, body.message);
    return buildSuccessResponse(true, 'The message has been successfully sent.');
  }

  @Delete('destroy/:id')
  async destroyClient(@Param('id') id: string): Promise<BaseResponse> {
    await this.wppService.destroyClient(id);
    return buildSuccessResponse(true, 'The client has been successfully destroyed.');
  }
}
