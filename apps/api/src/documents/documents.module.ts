import { Module } from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { DocumentsController } from "./documents.controller";
import { FilesService } from "src/files/files.service";

@Module({
  providers: [DocumentsService, FilesService],
  controllers: [DocumentsController],
  exports: [DocumentsService],
})
export class DocumentsModule {}
