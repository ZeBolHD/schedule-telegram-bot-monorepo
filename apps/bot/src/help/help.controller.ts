import { BotService } from "@/bot/bot.service";
import { Injectable } from "@nestjs/common";
import { Action, Ctx, Help, Update } from "nestjs-telegraf";
import { HelpService } from "./help.service";

import * as locales from "@/assets/locale.json";
import { Context } from "telegraf";
import { getParamFromCallbackQuery } from "@/lib";
import { CallbackQuery } from "telegraf/typings/core/types/typegram";
import { MediaGroup } from "telegraf/typings/telegram-types";

@Injectable()
@Update()
export class HelpController {
  constructor(private readonly helpService: HelpService) {}

  @Help()
  @Action("help")
  async help(@Ctx() context: Context) {
    const reply_markup = {
      inline_keyboard: [
        [
          {
            text: locales.help.teachers,
            callback_data: "help.departments",
          },
        ],
        [
          {
            text: locales.help.documents,
            callback_data: "help.documents",
          },
        ],
      ],
    };

    if (context.callbackQuery) {
      context.editMessageText(locales.help.get_help, { reply_markup });
      return;
    }

    context.reply(locales.help.get_help, { reply_markup });
  }

  @Action("help.documents")
  async selectDocument(@Ctx() context: Context) {
    const categories = await this.helpService.getDocumentCategories();
    const reply_markup = {
      inline_keyboard: categories
        .map((category) => {
          const query = `help.documents.${category.id}`;
          return [
            {
              text: category.name,
              callback_data: query,
            },
          ];
        })
        .concat([
          [
            {
              text: locales.back,
              callback_data: "help",
            },
          ],
        ]),
    };

    context.editMessageText(locales.help.select_documents, {
      reply_markup,
    });
  }

  @Action(/help\.documents\.*/)
  async getDocuments(@Ctx() context: Context) {
    context.deleteMessage(context.callbackQuery.message.message_id);

    const callbackQuery = (context.callbackQuery as CallbackQuery.DataQuery).data;
    const categoryId = Number(getParamFromCallbackQuery(callbackQuery, "documents"));

    const { name: categoryName, documents } =
      await this.helpService.getCategoryWithDocumentsById(categoryId);

    if (documents.length === 0) {
      context.reply(locales.help.no_documents);
      return;
    }

    const mediaGroup: MediaGroup = documents.map((document) => ({
      type: "document",
      media: document.fileId,
    }));

    mediaGroup[0].caption = categoryName;

    context.replyWithMediaGroup(mediaGroup);
  }

  @Action("help.departments")
  async selectDepartment(@Ctx() context: Context) {
    const departments = await this.helpService.getDepartments();

    const reply_markup = {
      inline_keyboard: departments
        .map((department) => {
          const query = `help.departments.${department.id}`;
          return [
            {
              text: department.name,
              callback_data: query,
            },
          ];
        })
        .concat([
          [
            {
              text: locales.back,
              callback_data: "help",
            },
          ],
        ]),
    };

    context.editMessageText(locales.help.select_department, { reply_markup });
  }

  @Action(/help\.departments\.*/)
  async getTeachers(@Ctx() context: Context) {
    const callbackQuery = (context.callbackQuery as CallbackQuery.DataQuery).data;
    const departmentId = Number(getParamFromCallbackQuery(callbackQuery, "departments"));
    const teachers = await this.helpService.getTeachersByDepartmentId(departmentId);
    const department = await this.helpService.getDepartmentById(departmentId);

    const teacherTextsWithMarkdown = teachers
      .map(({ name, place, contact }) => {
        return `*${name}*\n${place}${contact ? `\nКонтакт: ${contact}` : ""}\n\n`;
      })
      .join("");

    const text = `*${department.name}*` + "\n\n" + teacherTextsWithMarkdown;

    const textWithMarkdown = text
      .split("")
      .map((char) => (char.match(/(?<!\\)([_\[\]\(\)~`>#\+\-=|{}.!])/g) ? `\\${char}` : char))
      .join("");

    const reply_markup = {
      inline_keyboard: [
        [
          {
            text: locales.back,
            callback_data: "help.departments",
          },
        ],
      ],
    };

    context.editMessageText(textWithMarkdown, { reply_markup, parse_mode: "MarkdownV2" });
  }
}
