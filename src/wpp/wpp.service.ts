import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ClientInfo } from './classes/client-info';

@Injectable()
export class WppService {
  private clients: Map<string, ClientInfo> = new Map();

  async startClient(id: string) {
    const clientInfo = new ClientInfo(id);
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

    return clientInfo.client.info;
  }

  async sendMessage(id: string, number: string, message: string) {
    const clientInfo = this.getClient(id);

    await clientInfo.sendMessage(number, message);
  }

  async destroyClient(id: string) {
    const clientInfo = this.clients.get(id);
    if (clientInfo) {
      await clientInfo.destroy();
      this.clients.delete(id);
    }
  }
}
