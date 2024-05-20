import { BotService } from "@/bot/bot.service";
import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class HelpService {
  constructor(
    private readonly botService: BotService,
    private readonly prismaService: PrismaService,
  ) {}

  async getDepartments() {
    return await this.prismaService.department.findMany();
  }

  async getTeachersByDepartmentId(departmentId: number) {
    return await this.prismaService.teacher.findMany({
      where: { departmentId },
    });
  }

  async getDepartmentById(departmentId: number) {
    return await this.prismaService.department.findUnique({ where: { id: departmentId } });
  }

  async getDocumentCategories() {
    return await this.prismaService.documentCategory.findMany();
  }

  async getDocumentsByCategoryId(categoryId: number) {
    return await this.prismaService.document.findMany({
      where: { categoryId },
      select: { fileId: true, category: true },
    });
  }

  async getCategoryWithDocumentsById(categoryId: number) {
    return await this.prismaService.documentCategory.findUnique({
      where: { id: categoryId },
      select: { name: true, documents: true },
    });
  }
}
