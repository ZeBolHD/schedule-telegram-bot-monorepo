import { BadRequestException, Injectable } from "@nestjs/common";
import { BotService } from "src/bot/bot.service";

@Injectable()
export class FilesService {
  constructor(private readonly botService: BotService) {}

  async getFile(fileId: string) {
    if (!fileId) {
      throw new BadRequestException("File id is required");
    }

    return await this.botService.getDocumentURLByFileId(fileId);
  }
}
