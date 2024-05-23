import { Injectable } from "@nestjs/common";
import { InjectBot } from "nestjs-telegraf";
import { Telegraf } from "telegraf";

@Injectable()
export class BotService {
  constructor(@InjectBot("ScheduleBot") private readonly bot: Telegraf) {
    bot.telegram.setMyCommands([
      { command: "start", description: "Старт" },
      { command: "my_subscriptions", description: "Мои подписки" },
      { command: "select_group", description: "Выбрать группу" },
      { command: "my_groups", description: "Мои группы" },
      { command: "my_subscriptions", description: "Мои подписки" },
      { command: "help", description: "Помощь" },
    ]);

    bot.use(async (ctx, next) => {
      await next();
      if (!ctx.state.handled) {
        await ctx.reply("Такой команды не существует");
      }
    });
  }

  sendMessage = this.bot.telegram.sendMessage.bind(
    this.bot.telegram,
  ) as typeof this.bot.telegram.sendMessage;

  editMessage = this.bot.telegram.editMessageText.bind(
    this.bot.telegram,
  ) as typeof this.bot.telegram.editMessageText;
}
