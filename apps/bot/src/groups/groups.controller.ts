import { BotService } from "@/bot/bot.service";
import { Injectable, Logger } from "@nestjs/common";
import { Action, Command, Ctx, Sender, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { CallbackQuery } from "telegraf/typings/core/types/typegram";
import { GroupsService } from "./groups.service";

import * as locales from "@/assets/locale.json";
import { getParamFromCallbackQuery } from "@/lib";

@Injectable()
@Update()
export class GroupsController {
  private readonly logger = new Logger(GroupsController.name);
  constructor(private readonly groupsService: GroupsService) {}

  @Command("my_groups")
  @Action("my_groups")
  async myGroups(messageId: number, @Sender("id") senderId: number, @Ctx() context: Context) {
    context.state.handled = true;
    this.logger.log(
      `Received ${messageId ? "action" : "command"} my_groups from user with id:${senderId}`,
    );

    try {
      const userWithGroups = await this.groupsService.getUserGroups(senderId);
      const isUserWithGroups = !!userWithGroups.length;
      const text = userWithGroups.length ? locales.my_groups.groups : locales.my_groups.no_groups;

      const reply_markup = isUserWithGroups
        ? {
            inline_keyboard: userWithGroups
              .map((userWithGroup) => {
                const query = `delete_group.group.${userWithGroup.groupId}`;
                return [{ text: userWithGroup.group.code + " ❌", callback_data: query }];
              })
              .concat([
                [{ text: locales.get_schedule.get, callback_data: "get_schedule" }],
                [{ text: locales.select_group.command, callback_data: "select_group" }],
              ]),
          }
        : {
            inline_keyboard: [
              [{ text: locales.select_group.command, callback_data: "select_group" }],
            ],
          };

      if (messageId || context.callbackQuery) {
        await context.editMessageText(text, {
          reply_markup,
        });
        return;
      }

      await context.reply(text, { reply_markup });
    } catch (e) {
      this.logger.error("Failed to send message to telegram user", e);
      context;
    }
  }

  @Command("select_group")
  @Action("select_group")
  async showFaculties(@Ctx() context: Context) {
    context.state.handled = true;

    this.logger.log(`Received action /select_group from user with id:${context.from.id}`);
    const faculties = await this.groupsService.getFaculties();
    const reply_markup = {
      inline_keyboard: faculties.map((faculty) => {
        const query = `select_group.faculty.${faculty.id}`;
        return [
          {
            text: faculty.name,
            callback_data: query,
          },
        ];
      }),
    };

    if (context.callbackQuery) {
      await context.editMessageText(locales.select_group.faculty, { reply_markup });
      return;
    }

    await context.reply(locales.select_group.faculty, { reply_markup });
  }

  @Action(/select_group.faculty.*.grade.*.group.*/)
  async selectGroup(@Ctx() context: Context) {
    context.state.handled = true;

    const data = (context.callbackQuery as CallbackQuery.DataQuery).data;
    const groupId = Number(getParamFromCallbackQuery(data, "group"));
    const facultyId = Number(getParamFromCallbackQuery(data, "faculty"));
    const grade = Number(getParamFromCallbackQuery(data, "grade"));

    this.logger.log(
      `Received action select_group.faculty.${facultyId}.grade.${grade}.group.${groupId} from user with id:${context.from.id}`,
    );

    try {
      const userWithGroup = await this.groupsService.setUserWithGroup(context.from.id, groupId);

      if (!userWithGroup) {
        await context.editMessageText(locales.select_group.select_error);
        return;
      }

      const reply_markup = {
        inline_keyboard: [
          [{ text: locales.select_group.select_another_group, callback_data: "select_group" }],
          [{ text: locales.my_groups.command, callback_data: "my_groups" }],
        ],
      };

      await context.editMessageText(locales.select_group.selected + userWithGroup.group.code, {
        reply_markup,
      });
    } catch (e) {
      this.logger.error(e);
      await context.editMessageText(locales.select_group.select_error);
    }
  }

  @Action(/select_group.faculty.*.grade.*/)
  async showGroups(@Ctx() context: Context) {
    context.state.handled = true;

    const data = (context.callbackQuery as CallbackQuery.DataQuery).data;
    const facultyId = Number(getParamFromCallbackQuery(data, "faculty"));
    const grade = Number(getParamFromCallbackQuery(data, "grade"));

    this.logger.log(
      `Received action select_group.${facultyId}.grade.${grade} from user with id:${context.from.id}`,
    );

    try {
      const groups = await this.groupsService.getGroups(facultyId, grade);

      const reply_markup = {
        inline_keyboard: [
          ...groups.map((group) => {
            const query = `select_group.faculty.${facultyId}.grade.${grade}.group.${group.id}`;

            return [
              {
                text: group.code,
                callback_data: query,
              },
            ];
          }),
          [
            {
              text: locales.back,
              callback_data: `select_group.faculty.${facultyId}`,
            },
          ],
        ],
      };

      await context.editMessageText(locales.select_group.group, { reply_markup });
    } catch (e) {
      this.logger.error(e);
      this.logger.error("Failed to send message to telegram user", e);
      await context.editMessageText(locales.select_group.select_error);
    }
  }

  @Action(/select_group.faculty.*/)
  async showGrades(@Ctx() context: Context) {
    context.state.handled = true;

    const data = (context.callbackQuery as CallbackQuery.DataQuery).data;
    const facultyId = Number(getParamFromCallbackQuery(data, "faculty"));

    this.logger.log(
      `Received action select_group.faculty.${facultyId} from user with id:${context.from.id}`,
    );

    const grades = await this.groupsService.getGrades(facultyId);

    const reply_markup = {
      inline_keyboard: [
        ...grades.map((grade) => {
          const query = `select_group.faculty.${facultyId}.grade.${grade}`;

          return [
            {
              text: String(grade),
              callback_data: query,
            },
          ];
        }),
        [
          {
            text: locales.back,
            callback_data: `select_group`,
          },
        ],
      ],
    };

    await context.editMessageText(locales.select_group.grade, { reply_markup });
  }

  @Action(/delete_group.*/)
  async deleteGroup(@Ctx() context: Context) {
    context.state.handled = true;

    const data = (context.callbackQuery as CallbackQuery.DataQuery).data;
    const groupId = Number(getParamFromCallbackQuery(data, "group"));

    this.logger.log(
      `Received action delete_group.group.${groupId} from user with id:${context.from.id}`,
    );

    try {
      await this.groupsService.deleteUserWithGroup(context.from.id, groupId);

      this.myGroups(context.msgId, context.from.id, context);
    } catch (e) {
      this.logger.error(e);
      this.logger.error("Failed to send message to telegram user", e);

      await context.editMessageText(locales.select_group.select_error);
    }
  }
}
