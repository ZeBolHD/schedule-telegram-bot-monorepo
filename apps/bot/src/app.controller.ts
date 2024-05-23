import { Injectable, Logger } from "@nestjs/common";
import { Ctx, Sender, Start, Update } from "nestjs-telegraf";
import * as locale from "@/assets/locale.json";
import { Context } from "telegraf";

import { UserService } from "./user/user.service";

import { TelegramMessageSender } from "./types";

@Injectable()
@Update()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly userService: UserService) {}

  @Start()
  async start(@Sender() sender: TelegramMessageSender, @Ctx() context: Context) {
    context.state.handled = true;
    this.logger.log(
      `User with id:${sender.id}, username:${sender.username}, name:${sender.first_name} ${sender.last_name || ""} started bot`,
    );

    try {
      const user = await this.userService.findUser(sender.id);

      if (user) {
        context.reply(locale.start.user_exists);
        this.logger.log(`User with id:${sender.id} already registered`);
        return;
      }

      const newUser = await this.userService.registerUser(sender);

      if (!newUser) {
        this.logger.error("Error while registering user");
        context.reply(locale.error);
        return;
      }

      context.reply(locale.start.user_registered);

      this.logger.log(`User with id:${sender.id} registered successfully`);
    } catch (e) {
      this.logger.error("Error while registering user", e);
      context.reply(locale.error);
    }
  }
}
