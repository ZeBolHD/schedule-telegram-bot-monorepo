import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createReadStream } from "fs";

import { Telegraf } from "telegraf";
import { InputFile, InputMediaPhoto } from "telegraf/typings/core/types/typegram";

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);
  private bot: Telegraf;
  private UPLOAD_CHATID = this.configService.get<string>("UPLOAD_CHATID");

  constructor(private readonly configService: ConfigService) {
    const _token = this.configService.get<string>("BOT_TOKEN");
    this.bot = new Telegraf(_token);
  }

  async sendMessage(chatId: string, text: string) {
    await this.bot.telegram.sendMessage(chatId, text, { parse_mode: "Markdown" }).catch((e) => {
      this.logger.error(e);
      this.logger.error("Failed to send message to telegram user");
      throw new InternalServerErrorException();
    });
  }

  async sendMediaGroup(chatId: string, media: InputMediaPhoto[]) {
    await this.bot.telegram.sendMediaGroup(chatId, media).catch((e) => {
      this.logger.error(e);
      this.logger.error("Failed to send message to telegram user");
      throw new InternalServerErrorException("Failed to send message to telegram user");
    });
  }

  async getDocumentURLByFileId(fileId: string) {
    const { href } = await this.bot.telegram.getFileLink(fileId);

    if (!href) {
      throw new NotFoundException("Document not found");
    }

    return href;
  }

  async sendPhoto(chatId: string, image: InputFile) {
    const message = await this.bot.telegram
      .sendPhoto(chatId, image, { parse_mode: "Markdown" })
      .catch((e) => {
        this.logger.error(e);
        this.logger.error("Wrong image format");
        throw new BadRequestException("Wrong image format");
      });

    return message.photo[0].file_id;
  }

  async sendDocument(chatId: string, text: string, documentId: string) {
    await this.bot.telegram
      .sendDocument(chatId, documentId, { caption: text, parse_mode: "Markdown" })
      .catch((e) => {
        this.logger.error(e);
        this.logger.error("Wrong document format");
        throw new BadRequestException("Wrong document format");
      });
  }

  async getImageId(image: Express.Multer.File): Promise<string> {
    const message = await this.bot.telegram.sendPhoto(this.UPLOAD_CHATID, {
      source: image.buffer,
      filename: image.originalname,
    });

    return message.photo[0].file_id;
  }

  async getDocumentId(document: Express.Multer.File): Promise<string> {
    const message = await this.bot.telegram.sendDocument(this.UPLOAD_CHATID, {
      source: document.buffer,
      filename: document.originalname,
    });

    return message.document.file_id;
  }
}
