import { PrismaService } from "@/prisma/prisma.service";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class HelpService {
  private logger = new Logger(HelpService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async findAllDepartments() {
    this.logger.log("Finding all departments");
    return await this.prismaService.department.findMany();
  }

  async findAllTeachersByDepartmentId(departmentId: number) {
    this.logger.log(`Finding all teachers by department with id:${departmentId}`);
    return await this.prismaService.teacher.findMany({
      where: { departmentId },
    });
  }

  async findDepartmentById(departmentId: number) {
    this.logger.log(`Finding department with id:${departmentId}`);
    return await this.prismaService.department.findUnique({ where: { id: departmentId } });
  }

  async findAllDocumentCategories() {
    this.logger.log("Finding all document categories");
    return await this.prismaService.documentCategory.findMany();
  }

  async findAllDocumentsByCategoryId(categoryId: number) {
    this.logger.log(`Finding all documents by category with id:${categoryId}`);
    return await this.prismaService.document.findMany({
      where: { categoryId },
      select: { fileId: true, category: true },
    });
  }

  async findCategoryWithDocumentsById(categoryId: number) {
    this.logger.log(`Finding category with documents by id:${categoryId}`);
    return await this.prismaService.documentCategory.findUnique({
      where: { id: categoryId },
      select: { name: true, documents: true },
    });
  }
}
