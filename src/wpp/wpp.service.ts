import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ClientInfo } from './classes/client-info';
import { SendMessageWppDto } from './dto/send-message-wpp.dto';
import {
  isBase64,
  isNullOrUndefined,
} from 'src/utils/functions/checks.function';
import { addUsWpp, handledMessage } from 'src/utils/functions/wpp.function';
import { SendMessageFileWppDto } from './dto/send-message-file-wpp.dto';
import { MessageMedia } from 'whatsapp-web.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WppService {
  constructor(private configService: ConfigService) {}

  private readonly logger = new Logger(WppService.name, { timestamp: true });
  private clients: Map<string, ClientInfo> = new Map();

  async startClient(id: string) {
    this.logger.log(`Starting clientId ${id}`);

    if (this.clients.has(id)) {
      this.logger.error(`ClientId ${id} already exists`);
      throw new HttpException(
        `Client ${id} already exists`,
        HttpStatus.CONFLICT,
      );
    }

    const env = this.configService.get<string>('API_ENV');
    const clientInfo = new ClientInfo(env, id);
    this.clients.set(id, clientInfo);
    this.logger.log(`ClientId ${id} started`);
  }

  private getClient(id: string): ClientInfo | undefined {
    this.logger.log(`Getting clientId ${id}`);
    const clientInfo = this.clients.get(id);
    if (!clientInfo) {
      this.logger.error(`Client ${id} not found`);
      throw new HttpException(`ClientId ${id} not found`, HttpStatus.NOT_FOUND);
    }

    this.logger.log(`Client phone ${clientInfo.client.info.me.user} found`);

    return clientInfo;
  }

  getQrCode(id: string): string {
    this.logger.log(`Getting QR code from client ${id}`);

    return this.getClient(id).qrCode;
  }

  checkClient(id: string) {
    this.logger.log(`Checking client ${id}`);
    const clientInfo = this.getClient(id);

    return clientInfo.client.info ?? null;
  }

  async sendMessage(id: string, data: SendMessageWppDto) {
    this.logger.log(`Sending message from client ${id}`);
    const { message, send } = data;

    if (this.checkClient(id) === null) {
      this.logger.error(`Client ${id} is not ready`);
      throw new HttpException(
        `Client ${id} is not ready`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const wppClient = this.getClient(id).client;

    const requestArray = send.map(async (s) => {
      const isExistContact = await wppClient?.getNumberId(s.to);

      if (isNullOrUndefined(isExistContact)) {
        this.logger.error(`Contact ${s.to} not found`);
        return;
      }

      this.logger.log(
        `Sending message from ${wppClient.info.me.user} to ${s.to}`,
      );
      return await wppClient?.sendMessage(
        addUsWpp(s.to),
        handledMessage(message, s.params),
      );
    });

    void Promise.all(requestArray);
  }

  async sendFileMessage(id: string, data: SendMessageFileWppDto) {
    this.logger.log(`Sending file message from client ${id}`);
    const { message, send, file } = data;

    if (this.checkClient(id) === null) {
      this.logger.error(`Client ${id} is not ready`);
      throw new HttpException(
        `Client ${id} is not ready`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const wppClient = this.getClient(id).client;

    const requestArray = send.map(async (s) => {
      this.logger.log(
        `Sending file message from ${wppClient.info.me.user} to ${s.to}`,
      );
      const isExistContact = await wppClient?.getNumberId(s.to);

      if (isNullOrUndefined(isExistContact)) {
        this.logger.error(`Contact ${s.to} not found`);
        return;
      }

      if (
        isNullOrUndefined(file) ||
        isNullOrUndefined(file.data) ||
        file.data === '' ||
        !isBase64(file.data)
      ) {
        this.logger.error(`File data is not valid`);
        return await wppClient?.sendMessage(
          addUsWpp(s.to),
          handledMessage(message, s.params),
        );
      }

      const media = new MessageMedia(file.type, file.data, file.name);

      this.logger.log(
        `Sending file message from ${wppClient.info.me.user} to ${s.to}`,
      );
      return await wppClient?.sendMessage(addUsWpp(s.to), media, {
        caption: handledMessage(message, s.params),
      });
    });

    void Promise.all(requestArray);
  }

  async destroyClient(id: string) {
    this.logger.log(`Destroying client ${id}`);
    const clientInfo = this.clients.get(id);
    if (clientInfo) {
      this.logger.log(
        `ClientId  ${id} with Client Phone ${clientInfo.client.info.me.user} destroyed`,
      );
      await clientInfo.destroy();
      this.clients.delete(id);
    }
  }
}
