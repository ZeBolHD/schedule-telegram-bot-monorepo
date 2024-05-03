import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "@prisma/prisma.service";
import { SendAnnouncementDto, SendNewsDto } from "./dto";
import { Media } from "./types";
import axios from "axios";

@Injectable()
export class NotificationsService {
  private logger = new Logger(NotificationsService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
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

  async sendNews(dto: SendNewsDto) {
    this.logger.log(`Sending news with heading: ${dto.heading}`);

    const messageText = `*${dto.heading}*` + "\n\n" + dto.text;

    const media: Media[] = await this.getMedia(dto.images, messageText);

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

  async sendTelegramDocument(chatId: string, document: Blob) {
    const url = this.SENDDOCUMENT_URL;

    await axios
      .post(url, {
        chat_id: chatId,
        document,
      })
      .catch((e) => {
        this.logger.error(e);
        this.logger.error(`Failed to send document to ${chatId}`);

        throw new InternalServerErrorException("Failed to send document");
      });
  }

  private async sendTelegramMessage(chatId: string, messageText: string, media?: Media[]) {
    const url = media && media.length > 0 ? this.SENDMEDIAGROUP_URL : this.SENDMESSAGE_URL;
    await axios
      .post(url, {
        chat_id: chatId,
        text: messageText,
        media,
        parse_mode: "Markdown",
      })
      .catch((e) => {
        this.logger.error(e);
        this.logger.error(`Failed to send message to ${chatId}`);

        throw new InternalServerErrorException("Failed to send message");
      });
  }

  private async getMedia(images: Blob[], messageText: string): Promise<Media[]> {
    if (!images || images.length === 0) {
      return [];
    }

    this.logger.log("Getting media fileIds");

    const media: Media[] = [];

    for (const image of images) {
      const id = await this.getImageId(image);

      media.push({
        type: "photo",
        media: id,
      });
    }

    media[0] = { ...media[0], caption: messageText, parse_mode: "Markdown" };

    this.logger.log("Got media fileIds");

    return media;
  }

  private async getImageId(document: Blob) {
    const formData: FormData = new FormData();

    formData.append("chat_id", this.CHAT_ID);
    formData.append("image", document);

    const { data } = await axios
      .post(this.SENDPHOTO_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((e) => {
        this.logger.error(e);
        this.logger.error("Failed to send image");
        throw new InternalServerErrorException("Failed to send image");
      });

    return data.result.photo[0].file_id;
  }
}
