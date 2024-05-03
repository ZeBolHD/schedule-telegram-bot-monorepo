import { Body, Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { Roles } from "@common/decorators";
import { Role } from "@repo/database";
import { RolesGuard } from "@auth/guards/role.guard";

import { SendNewsDto, SendAnnouncementDto } from "./dto";
import { NotificationsService } from "./notifications.service";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post("announcement")
  async sendAnnouncement(@Body() dto: SendAnnouncementDto) {
    return this.notificationsService.sendAnnouncement(dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FilesInterceptor("images"))
  @Post("news")
  async sendNews(@Body() dto: SendNewsDto, @UploadedFiles() images: Express.Multer.File[]) {
    return this.notificationsService.sendNews(dto, images);
  }
}
