import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { Logger } from '@nestjs/common';

export class ClientInfo {
  public id: string;
  public qrCode: string = null;
  public client: Client;
  private env: string;

  private readonly logger = new Logger(ClientInfo.name);

  constructor(env: string, id: string) {
    this.env = env;
    this.id = id;
    this.client = new Client({
      authStrategy: new LocalAuth({ clientId: id }),
      puppeteer: {
        executablePath: '/usr/bin/chromium-browser',
        // executablePath:
        // 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-extensions',
        ],
      },
    });

    this.client.on('qr', (qr) => {
      this.env === 'dev' ? qrcode.generate(qr, { small: true }) : null;
      this.qrCode = qr;
    });

    this.client.on('ready', () => {
      this.logger.log(
        `WhatsApp client phone ${this.client.info?.me.user} is ready!`,
      );
    });

    this.client.on('message_create', (message) => {
      if (message.body === '!ping') {
        console.log(`Message received from ${id}: ${message.body}`);
        this.client.sendMessage(message.from, 'pong');
      }
    });

    this.client.on('disconnected', (message) => {
      this.logger.log(
        `WhatsApp client phone ${this.client.info?.me.user} was disconnected!`,
      );
      console.log(message);

      this.client.destroy();
    });

    this.initialize();
  }

  private async initialize() {
    await this.client.initialize();
  }

  async sendMessage(number: string, message: string) {
    const chatId = `${number}@c.us`;
    await this.client.sendMessage(chatId, message);
  }

  async destroy() {
    await this.client.destroy();
  }
}
