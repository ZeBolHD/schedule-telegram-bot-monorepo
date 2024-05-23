import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { CreateDocumentCategoryDto } from "./dto";
import { BotService } from "src/bot/bot.service";

import { Document } from "@repo/database";

@Injectable()
export class DocumentsService {
  private logger = new Logger(DocumentsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly botService: BotService,
  ) {}

  async findAllDocumentCategories() {
    this.logger.log("Finding all document categories");
    const documentCategories = await this.prismaService.documentCategory
      .findMany({
        select: {
          id: true,
          name: true,
          documents: true,
        },
      })
      .catch((err) => {
        this.logger.error(err);
        throw new BadRequestException("Failed to get document categories");
      });

    this.logger.log("Found all document categories");

    return documentCategories;
  }

  async createDocumentCategory(dto: CreateDocumentCategoryDto) {
    this.logger.log(`Creating document category ${dto.name}`);

    const documentCategoryExists = await this.prismaService.documentCategory.findUnique({
      where: {
        name: dto.name,
      },
    });

    if (documentCategoryExists) {
      throw new ConflictException(`Document category ${dto.name} already exists`);
    }

    const documentCategory = this.prismaService.documentCategory
      .create({
        data: dto,
      })
      .catch((err) => {
        this.logger.error(`Failed to create document category ${dto.name}`);
        this.logger.error(err);
        throw new BadRequestException(`Failed to create document category ${dto.name}`);
      });

    this.logger.log(`Created document category ${dto.name}`);

    return documentCategory;
  }

  async deleteDocumentCategory(id: number) {
    this.logger.log(`Deleting document category ${id}`);

    const documentCategory = await this.prismaService.documentCategory.findUnique({
      where: { id },
    });
    if (!documentCategory) {
      throw new NotFoundException(`Document category with id ${id} not found`);
    }

    const deletedDocumentCategory = await this.prismaService.documentCategory
      .delete({
        where: { id },
      })
      .catch((err) => {
        this.logger.error(`Failed to delete document category ${id}`);
        this.logger.error(err);
        throw new BadRequestException(`Failed to delete document category ${id}`);
      });

    this.logger.log(`Deleted document category ${id}`);

    return deletedDocumentCategory;
  }

  async editDocumentCategory(id: number, dto: CreateDocumentCategoryDto) {
    this.logger.log(`Editing document category ${id}`);

    const documentCategory = await this.prismaService.documentCategory.findUnique({
      where: { id },
    });
    if (!documentCategory) {
      throw new NotFoundException(`Document category with id ${id} not found`);
    }

    const editedDocumentCategory = await this.prismaService.documentCategory
      .update({
        where: { id },
        data: dto,
      })
      .catch((err) => {
        this.logger.error(`Failed to edit document category ${id}`);
        this.logger.error(err);
        throw new BadRequestException(`Failed to edit document category ${id}`);
      });

    this.logger.log(`Edited document category ${id}`);

    return editedDocumentCategory;
  }

  async findCategoryById(id: number) {
    this.logger.log(`Finding document category with id:${id}`);
    const category = await this.prismaService.documentCategory.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        documents: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Document category with id ${id} not found`);
    }

    return category;
  }

  async addDocumentsToCategory(categoryId: number, documents: Express.Multer.File[]) {
    this.logger.log(`Adding ${documents.length} documents to category ${categoryId}`);
    const category = await this.prismaService.documentCategory.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException(`Document category with id ${categoryId} not found`);
    }

    const existsDocuments = await this.prismaService.document.findMany({
      where: {
        name: {
          in: documents.map((document) => document.originalname),
        },
        categoryId: categoryId,
      },
    });

    if (existsDocuments.length > 0) {
      throw new ConflictException(
        `Documents with names ${existsDocuments.map((document) => document.name)} already exists in this category`,
      );
    }

    documents.forEach((document) => {
      document.originalname = Buffer.from(document.originalname, "latin1").toString("utf-8");
    });

    const documentWithFileId: Omit<Document, "id">[] = [];

    for (const document of documents) {
      const fileId = await this.botService.getDocumentId(document);
      documentWithFileId.push({
        name: document.originalname,
        categoryId: categoryId,
        fileId,
      });
    }

    const createdDocuments = await this.prismaService.document
      .createMany({
        data: documentWithFileId,
        skipDuplicates: true,
      })
      .catch((err) => {
        this.logger.error(`Failed to create documents in category ${categoryId}`);
        this.logger.error(err);
        throw new BadRequestException(`Failed to create documents in category ${categoryId}`);
      });

    this.logger.log(`Added ${documents.length} documents to category ${categoryId}`);

    return createdDocuments;
  }

  async deleteDocument(id: number) {
    this.logger.log(`Deleting document ${id}`);
    const document = await this.prismaService.document.findUnique({
      where: {
        id,
      },
    });
    if (!document) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    const deletedDocument = await this.prismaService.document
      .delete({
        where: { id },
      })
      .catch((err) => {
        this.logger.error(`Failed to delete document ${id}`);
        this.logger.error(err);
        throw new BadRequestException(`Failed to delete document ${id}`);
      });

    this.logger.log(`Deleted document ${id}`);

    return deletedDocument;
  }
}
