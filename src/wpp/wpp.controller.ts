import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { WppService } from './wpp.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SendMessageWppDto } from './dto/send-message-wpp.dto';
import { JwtAuthGuard } from 'src/auth/utils/jwt-auth.guard';
import {
  BaseResponse,
  buildSuccessResponse,
} from 'src/utils/functions/responses.function';
import { SendMessageFileWppDto } from './dto/send-message-file-wpp.dto';

@ApiTags('wpp')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wpp')
export class WppController {
  constructor(private readonly wppService: WppService) { }

  @Get('start')
  @ApiOperation({ summary: 'Start client' })
  @ApiResponse({
    status: 200,
    description: 'The client has been successfully start.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async startClient(@Request() req): Promise<BaseResponse> {
    await this.wppService.startClient(req.user.phone);
    return buildSuccessResponse(
      true,
      'The client has been successfully start.',
    );
  }

  @Get('qrcode')
  @ApiOperation({ summary: 'Check if qrCode returned' })
  @ApiResponse({
    status: 200,
    description: '',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async qrCode(@Request() req): Promise<BaseResponse> {
    const qrCode = await this.wppService.getQrCode(req.user.phone);
    return buildSuccessResponse(
      true,
      qrCode,
    );
  }

  @Get('checkClient')
  @ApiOperation({ summary: 'Check if client is connected' })
  @ApiResponse({
    status: 200,
    description: '',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async checkClient(@Request() req): Promise<BaseResponse> {
    const clientData = await this.wppService.checkClient(req.user.phone);
    return buildSuccessResponse(
      true,
      clientData,
    );
  }

  @Post('sendActiveMessage')
  @ApiOperation({ summary: 'Send a message' })
  @ApiResponse({
    status: 200,
    description: 'The message has been successfully sent.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async sendMessage(@Request() req, @Body() body: SendMessageWppDto): Promise<BaseResponse> {
    await this.wppService.sendMessage(req.user.phone, body);
    return buildSuccessResponse(
      true,
      'The message has been successfully sent.',
    );
  }

  @Post('sendActiveFileMessage')
  @ApiOperation({ summary: 'Send a message' })
  @ApiResponse({
    status: 200,
    description: 'The message has been successfully sent.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async sendFileMessage(@Request() req, @Body() body: SendMessageFileWppDto): Promise<BaseResponse> {
    await this.wppService.sendFileMessage(req.user.phone, body);
    return buildSuccessResponse(
      true,
      'The message has been successfully sent.',
    );
  }

  @Delete('destroy/:id')
  async destroyClient(@Param('id') id: string): Promise<BaseResponse> {
    await this.wppService.destroyClient(id);
    return buildSuccessResponse(
      true,
      'The client has been successfully destroyed.',
    );
  }
}
