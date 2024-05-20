import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { RolesGuard } from "@auth/guards/role.guard";
import { Roles } from "@common/decorators";
import { Role } from "@repo/database";
import { CreateDocumentCategoryDto } from "./dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { FilesService } from "src/files/files.service";
import { Response } from "express";

@Controller("documents")
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly filesService: FilesService,
  ) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get("categories/:categoryId")
  async getDocumentsByCategoryId(@Param("categoryId") categoryId: string) {
    return this.documentsService.getCategoryById(+categoryId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get("categories")
  async findAllDocumentCategories() {
    return this.documentsService.findAllDocumentCategories();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post("categories")
  async createDocumentCategory(@Body() dto: CreateDocumentCategoryDto) {
    return this.documentsService.createDocumentCategory(dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete("categories/:id")
  async deleteDocumentCategory(@Param("id") id: string) {
    return this.documentsService.deleteDocumentCategory(+id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch("categories/:id")
  async editDocumentCategory(@Param("id") id: string, @Body() dto: CreateDocumentCategoryDto) {
    return this.documentsService.editDocumentCategory(+id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FilesInterceptor("documents"))
  @Post("categories/:id")
  async uploadFiles(@Param("id") id: string, @UploadedFiles() documents: Express.Multer.File[]) {
    console.log(documents);
    return this.documentsService.addDocumentsToCategory(+id, documents);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get(":id")
  async getFile(@Param("id") fileId: string, @Res() res: Response) {
    const url = await this.filesService.getFile(fileId);
    res.redirect(url);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(":id")
  async deleteDocument(@Param("id") id: string) {
    return this.documentsService.deleteDocument(+id);
  }
}
