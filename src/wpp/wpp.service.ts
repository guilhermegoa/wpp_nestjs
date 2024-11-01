import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ClientInfo } from './classes/client-info';
import { SendMessageWppDto } from './dto/send-message-wpp.dto';
import { isBase64, isNullOrUndefined } from 'src/utils/functions/checks.function';
import { addUsWpp, handledMessage } from 'src/utils/functions/wpp.function';
import { SendMessageFileWppDto } from './dto/send-message-file-wpp.dto';
import { MessageMedia } from 'whatsapp-web.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WppService {
  constructor(private configService: ConfigService) {}

  private clients: Map<string, ClientInfo> = new Map();

  async startClient(id: string) {
    if (this.clients.has(id)) {
      throw new HttpException(`Client ${id} already exists`, HttpStatus.CONFLICT);
    }
    
    const env = this.configService.get<string>('API_ENV');
    const clientInfo = new ClientInfo(env, id);
    this.clients.set(id, clientInfo);
  }

  private getClient(id: string): ClientInfo | undefined {
    const clientInfo = this.clients.get(id);
    if (!clientInfo) {
      throw new HttpException(`Client ${id} not found`, HttpStatus.NOT_FOUND);
    }

    return clientInfo;
  }

  getQrCode(id: string): string {
    return this.getClient(id).qrCode;
  }

  checkClient(id: string) {
    const clientInfo = this.getClient(id);

    return clientInfo.client.info ?? null;
  }

  async sendMessage(id: string, data: SendMessageWppDto) {
    const { message, send } = data;

    if (this.checkClient(id) === null) {
      throw new HttpException(`Client ${id} is not ready`, HttpStatus.NOT_ACCEPTABLE);
    }

    const wppClient = this.getClient(id).client;

    const requestArray = send.map(async (s) => {
      const isExistContact = await wppClient?.getNumberId(s.to);

      if (isNullOrUndefined(isExistContact)) {
        return;
      }

      return await wppClient?.sendMessage(
        addUsWpp(s.to),
        handledMessage(message, s.params),
      );
    });

    void Promise.all(requestArray);
  }

  async sendFileMessage(id: string, data: SendMessageFileWppDto) {
    const { message, send, file } = data;

    if (this.checkClient(id) === null) {
      throw new HttpException(`Client ${id} is not ready`, HttpStatus.NOT_ACCEPTABLE);
    }

    const wppClient = this.getClient(id).client;

    const requestArray = send.map(async (s) => {
      const isExistContact = await wppClient?.getNumberId(s.to);

      if (isNullOrUndefined(isExistContact)) {
        return;
      }

      if (isNullOrUndefined(file) || 
        isNullOrUndefined(file.data) || 
        file.data === '' ||
        !isBase64(file.data))
      {
          return await wppClient?.sendMessage(addUsWpp(s.to), handledMessage(message, s.params));
      }

      const media = new MessageMedia(file.type, file.data, file.name);

      return await wppClient?.sendMessage(addUsWpp(s.to), media, {
        caption: handledMessage(message, s.params),
      });
    });

    void Promise.all(requestArray);
  }

  async destroyClient(id: string) {
    const clientInfo = this.clients.get(id);
    if (clientInfo) {
      await clientInfo.destroy();
      this.clients.delete(id);
    }
  }
}
