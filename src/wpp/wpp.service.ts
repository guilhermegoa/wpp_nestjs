import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientInfo } from './classes/client-info';

@Injectable()
export class WppService {
  private clients: Map<string, ClientInfo> = new Map();

  async startClient(id: string) {
    const clientInfo = new ClientInfo(id);
    this.clients.set(id, clientInfo);
  }

  getClient(id: string): ClientInfo | undefined {
    return this.clients.get(id);
  }

  async sendMessage(id: string, number: string, message: string) {
    const clientInfo = this.getClient(id);
    if (!clientInfo) {
      throw new Error(`Client with id ${id} not found`);
    }
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
