import { Action, Command, Ctx, Sender, Update } from "nestjs-telegraf";
import { Logger } from "@nestjs/common";
import { Context } from "telegraf";

import * as locales from "@/assets/locale.json";
import { ScheduleService } from "./schedule.service";

@Update()
export class ScheduleController {
  private readonly logger = new Logger(ScheduleController.name);
  constructor(private readonly scheduleService: ScheduleService) {}

  @Command("get_schedule")
  @Action("get_schedule")
  async getSchedule(@Ctx() context: Context, @Sender("id") senderId: number) {
    context.state.handled = true;
    this.logger.log(`Received command /get_schedule from user with id:${senderId}`);
    const scheduleFilesWithGroups = await this.scheduleService.getScheduleFiles(senderId);

    try {
      if (context.callbackQuery) {
        await context.deleteMessage(context.callbackQuery.message.message_id);
      }

      if (scheduleFilesWithGroups.length === 0) {
        await context.reply(locales.get_schedule.get_error);
      }

      for (const scheduleFileWithGroup of scheduleFilesWithGroups) {
        if (!scheduleFileWithGroup.fileId) {
          await context.reply(
            locales.get_schedule.no_schedule_start +
              scheduleFileWithGroup.groupCode +
              locales.get_schedule.no_schedule_end,
          );

          continue;
        }

        await context.replyWithDocument(scheduleFileWithGroup.fileId, {
          caption: locales.get_schedule.send_schedule + scheduleFileWithGroup.groupCode,
        });

        this.logger.log(
          `Sent schedule for group ${scheduleFileWithGroup.groupCode} to user with id:${senderId}`,
        );
      }
    } catch (e) {
      this.logger.error("Error while getting schedule", e);
      await context.reply(locales.get_schedule.get_error);
    }
  }
}
