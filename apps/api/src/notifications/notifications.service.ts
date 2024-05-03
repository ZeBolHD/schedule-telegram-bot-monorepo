import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "@prisma/prisma.service";
import { SendAnnouncementDto, SendNewsDto } from "./dto";
import { BotService } from "src/bot/bot.service";
import { InputMediaPhoto } from "telegraf/typings/core/types/typegram";

@Injectable()
export class NotificationsService {
  private logger = new Logger(NotificationsService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly botService: BotService,
  ) {}

  private BOT_TOKEN = this.configService.get<string>("BOT_TOKEN", "");
  private CHAT_ID = this.configService.get<string>("UPLOAD_CHATID", "");

  private SENDPHOTO_URL = `https://api.telegram.org/bot${this.BOT_TOKEN}/sendPhoto`;
  private SENDMEDIAGROUP_URL = `https://api.telegram.org/bot${this.BOT_TOKEN}/sendMediaGroup`;
  private SENDMESSAGE_URL = `https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`;
  private SENDDOCUMENT_URL = `https://api.telegram.org/bot${this.BOT_TOKEN}/sendDocument`;

  async sendAnnouncement(dto: SendAnnouncementDto) {
    this.logger.log(`Sending announcement with heading: ${dto.heading}`);

    const messageText = `*${dto.heading}*` + "\n\n" + dto.text;

    const users = await this.prismaService.userWithSubscription.findMany({
      where: {
        subscriptionId: 2,
      },
    });

    const chatIds = users.map((user) => user.userId);

    for (const chatId of chatIds) {
      await this.sendTelegramMessage(chatId, messageText);
    }

    this.logger.log(`Sent announcement with heading: ${dto.heading}`);
  }

  async sendNews(dto: SendNewsDto, images: Express.Multer.File[]) {
    this.logger.log(`Sending news with heading: ${dto.heading}`);

    const messageText = `*${dto.heading}*` + "\n\n" + dto.text;

    const media: InputMediaPhoto[] = await this.getMedia(images, messageText);

    const users = await this.prismaService.userWithSubscription.findMany({
      where: {
        subscriptionId: 3,
      },
    });

    const chatIds = users.map((user) => user.userId);

    for (const chatId of chatIds) {
      await this.sendTelegramMessage(chatId, messageText, media);
    }

    this.logger.log(`Sent news with heading: ${dto.heading}`);
  }

  async sendScheduleNotificationToGroup(groupId: number, fileId: string) {
    const text = "Ваше расписание изменено!";

    this.logger.log(`Sending schedule notification to group ${groupId}`);

    const usersWithGroup = await this.prismaService.userWithGroup.findMany({
      where: {
        groupId,
      },
    });

    const usersWithSubscription = await this.prismaService.userWithSubscription.findMany({
      where: {
        subscriptionId: 1,
        AND: {
          userId: {
            in: usersWithGroup.map((user) => user.userId),
          },
        },
      },
    });

    const chatIds = usersWithSubscription.map((user) => user.userId);

    for (const chatId of chatIds) {
      await this.botService.sendDocument(chatId, text, fileId);
    }

    this.logger.log(`Sent schedule notification to group ${groupId}`);
  }

  private async sendTelegramMessage(
    chatId: string,
    messageText: string,
    media?: InputMediaPhoto[],
  ) {
    if (media && media.length > 0) {
      await this.botService.sendMediaGroup(chatId, media);
    } else {
      await this.botService.sendMessage(chatId, messageText);
    }
  }

  private async getMedia(
    images: Express.Multer.File[],
    messageText: string,
  ): Promise<InputMediaPhoto[]> {
    if (!images || images.length === 0) {
      return [];
    }

    this.logger.log("Getting media fileIds");

    const media: InputMediaPhoto[] = [];

    for (const image of images) {
      const id = await this.botService.getImageId(image);

      media.push({
        media: id,
        type: "photo",
      });
    }

    media[0] = { ...media[0], caption: messageText, parse_mode: "Markdown" };

    this.logger.log("Got media fileIds");

    return media;
  }
}
