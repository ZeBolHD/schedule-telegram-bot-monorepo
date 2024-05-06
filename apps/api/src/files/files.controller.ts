import { Controller, Get, Param, Res } from "@nestjs/common";
import { Public } from "@common/decorators";
import { Response } from "express";

import { FilesService } from "./files.service";

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Public()
  @Get(":fileId")
  async getFile(@Param("fileId") fileId: string, @Res() res: Response) {
    const url = await this.filesService.getFile(fileId);
    res.redirect(url);
  }
}
