import { Logger } from "@nestjs/common";
import { Action, Command, Ctx, Sender, Update } from "nestjs-telegraf";
import { SubscriptionService } from "./subscription.service";
import { subscriptions } from "@/common/constants";
import { Context } from "telegraf";

import * as locales from "@/assets/locale.json";
import { getParamFromCallbackQuery } from "@/lib";
import { CallbackQuery } from "telegraf/typings/core/types/typegram";

@Update()
export class SubscriptionController {
  private readonly logger = new Logger(SubscriptionController.name);
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Command("my_subscriptions")
  @Action("my_subscriptions")
  async mySubscriptions(@Sender("id") senderId: number, @Ctx() context: Context) {
    context.state.handled = true;

    const callbackQuery = context.callbackQuery as CallbackQuery.DataQuery;

    this.logger.log(
      `Received ${callbackQuery ? "action" : "command"} my_subscriptions from user with id:${senderId}`,
    );

    try {
      const userSubscriptions = await this.subscriptionService.getUserSubscriptions(senderId);
      const userSubscriptionsIds = userSubscriptions.map(
        (subscription) => subscription.subscriptionId,
      );

      const reply_markup = {
        inline_keyboard: subscriptions.map((subscription) => {
          const isSelected = userSubscriptionsIds.includes(subscription.id);

          const text = `${subscription.name}   ${isSelected ? "✅" : "❌"}`;

          const query = isSelected
            ? `unsubscribe.${subscription.id}`
            : `subscribe.${subscription.id}`;

          return [
            {
              text: text,
              callback_data: query,
            },
          ];
        }),
      };

      if (callbackQuery) {
        await context.editMessageText(locales.subscriptions.my_subscriptions, {
          reply_markup,
        });

        this.logger.log("Sent message with subscriptions to user with id:", senderId);
        return;
      }

      await context.reply(locales.subscriptions.my_subscriptions, {
        reply_markup,
      });

      this.logger.log("Sent message with subscriptions to user with id:", senderId);
    } catch (e) {
      this.logger.error("Error while getting user subscriptions", e);
      context.reply(locales.error);
    }
  }

  @Action(/unsubscribe\.*/)
  async unsubscribe(@Ctx() context: Context) {
    context.state.handled = true;

    const callbackQuery = (context.callbackQuery as CallbackQuery.DataQuery).data;
    const subscriptionId = Number(getParamFromCallbackQuery(callbackQuery, "unsubscribe"));

    const userId = context.from.id;

    this.logger.log(`Received action callbackQuery from user with id:${context.from.id}`);

    try {
      await this.subscriptionService.unsubscribe(userId, subscriptionId);

      this.logger.log(
        `User with id:${userId} unsubscribed from subscription with id:${subscriptionId}`,
      );

      await this.mySubscriptions(userId, context);
    } catch (e) {
      this.logger.error("Error while unsubscribing from subscription", e);
      context.reply(locales.error);
    }
  }

  @Action(/subscribe\.*/)
  async subscribe(@Ctx() context: Context) {
    context.state.handled = true;

    const callbackQuery = (context.callbackQuery as CallbackQuery.DataQuery).data;
    const subscriptionId = Number(getParamFromCallbackQuery(callbackQuery, "subscribe"));

    const userId = context.from.id;

    this.logger.log(
      `Received action subscribe.subscription.${subscriptionId} from user with id:${context.from.id}`,
    );

    try {
      await this.subscriptionService.subscribe(userId, subscriptionId);

      this.logger.log(
        `User with id:${userId} subscribed to subscription with id:${subscriptionId}`,
      );

      await this.mySubscriptions(userId, context);
    } catch (e) {
      this.logger.error("Error while subscribing to subscription", e);
      context.reply(locales.error);
    }
  }
}
