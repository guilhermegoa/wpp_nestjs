import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';

export class ClientInfo {
  public id: string;
  public qrCode: string = null;
  public client: Client;

  constructor(id: string) {
    this.id = id;
    this.client = new Client({
      authStrategy: new LocalAuth({ clientId: id }),
      puppeteer: {
        executablePath: '/usr/bin/chromium-browser',
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-extensions',
        ],
      },
      webVersionCache: {
        type: 'remote',
        remotePath:
          'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
      },
    });

    this.client.on('qr', (qr) => {
      qrcode.generate(qr, { small: true });
      this.qrCode = qr;
    });

    this.client.on('ready', () => {
      console.log(`WhatsApp client ${id} is ready!`);
    });

    this.client.on('message', (message) => {
      console.log(`Message received from ${id}: ${message.body}`);
      if (message.body === 'ping') {
        message.reply('pong');
      }
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
