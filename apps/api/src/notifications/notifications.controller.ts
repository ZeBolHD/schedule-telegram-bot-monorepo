import { Body, Controller, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
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
  @UseInterceptors(FileInterceptor("images"))
  @Post("news")
  async sendNews(@Body() dto: SendNewsDto) {
    return this.notificationsService.sendNews(dto);
  }
}
