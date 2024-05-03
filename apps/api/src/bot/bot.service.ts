import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Telegraf } from "telegraf";
import { InputFile, InputMediaPhoto } from "telegraf/typings/core/types/typegram";

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);
  private bot: Telegraf;

  constructor(private readonly configService: ConfigService) {
    const _token = this.configService.get<string>("BOT_TOKEN");
    this.bot = new Telegraf(_token);
  }

  async sendMessage(chatId: string, text: string) {
    await this.bot.telegram.sendMessage(chatId, text).catch((e) => {
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

  async sendPhoto(chatId: string, image: InputFile) {
    const message = await this.bot.telegram.sendPhoto(chatId, image).catch((e) => {
      this.logger.error(e);
      this.logger.error("Wrong image format");
      throw new BadRequestException("Wrong image format");
    });

    return message.photo[0].file_id;
  }
}
