import { BotService } from "@/bot/bot.service";
import { Injectable, Logger } from "@nestjs/common";
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
  private readonly logger = new Logger(HelpController.name);
  constructor(private readonly helpService: HelpService) {}

  @Help()
  @Action("help")
  async help(@Ctx() context: Context) {
    context.state.handled = true;

    this.logger.log(
      `Received ${context.callbackQuery ? "action" : "command"} help from user with id:${context.from.id}`,
    );

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

    try {
      if (context.callbackQuery) {
        context.editMessageText(locales.help.get_help, { reply_markup });
        this.logger.log("Sent message with help to user with id:", context.from.id);
        return;
      }

      await context.reply(locales.help.get_help, { reply_markup });

      this.logger.log("Sent message with help to user with id:", context.from.id);
    } catch (e) {
      this.logger.error("Error while getting help", e);
      context.reply(locales.error);
    }
  }

  @Action("help.documents")
  async selectDocument(@Ctx() context: Context) {
    context.state.handled = true;

    this.logger.log(`Received action help.documents from user with id:${context.from.id}`);

    try {
      const categories = await this.helpService.findAllDocumentCategories();
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

      await context.editMessageText(locales.help.select_documents, {
        reply_markup,
      });

      this.logger.log("Sent message with documents to user with id:", context.from.id);
    } catch (e) {
      this.logger.error("Error while getting documents", e);
      context.reply(locales.error);
    }
  }

  @Action(/help\.documents\.*/)
  async getDocuments(@Ctx() context: Context) {
    context.state.handled = true;

    const callbackQuery = (context.callbackQuery as CallbackQuery.DataQuery).data;

    this.logger.log(`Received action ${callbackQuery} from user with id:${context.from.id}`);

    try {
      const categoryId = Number(getParamFromCallbackQuery(callbackQuery, "documents"));

      const { name: categoryName, documents } =
        await this.helpService.findCategoryWithDocumentsById(categoryId);

      if (documents.length === 0) {
        await context.reply(locales.help.no_documents);
        return;
      }

      const mediaGroup: MediaGroup = documents.map((document) => ({
        type: "document",
        media: document.fileId,
      }));

      mediaGroup[documents.length - 1].caption = categoryName;

      console.log(context.msgId);
      await context.deleteMessage(context.msgId);

      await context.replyWithMediaGroup(mediaGroup);

      this.logger.log("Sent message with documents to user with id:", context.from.id);
    } catch (e) {
      this.logger.error("Error while getting documents", e);
      context.reply(locales.error);
    }
  }

  @Action("help.departments")
  async selectDepartment(@Ctx() context: Context) {
    context.state.handled = true;

    this.logger.log(`Received action help.departments from user with id:${context.from.id}`);

    try {
      const departments = await this.helpService.findAllDepartments();

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

      await context.editMessageText(locales.help.select_department, { reply_markup });

      this.logger.log("Sent message with departments to user with id:", context.from.id);
    } catch (e) {
      this.logger.error("Error while getting departments", e);
      context.reply(locales.error);
    }
  }

  @Action(/help\.departments\.*/)
  async getTeachers(@Ctx() context: Context) {
    context.state.handled = true;

    const callbackQuery = (context.callbackQuery as CallbackQuery.DataQuery).data;
    const departmentId = Number(getParamFromCallbackQuery(callbackQuery, "departments"));

    this.logger.log(`Received action ${callbackQuery} from user with id:${context.from.id}`);

    try {
      const teachers = await this.helpService.findAllTeachersByDepartmentId(departmentId);
      const department = await this.helpService.findDepartmentById(departmentId);

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

      await context.editMessageText(textWithMarkdown, { reply_markup, parse_mode: "MarkdownV2" });

      this.logger.log("Sent message with teachers to user with id:", context.from.id);
    } catch (e) {
      this.logger.error("Error while getting teachers", e);
      context.reply(locales.error);
    }
  }
}
