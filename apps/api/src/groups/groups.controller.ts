import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { GroupsService } from "./groups.service";
import { RolesGuard } from "@auth/guards/role.guard";
import { Roles } from "@common/decorators";
import { Role } from "@repo/database";

import { CreateGroupDto, FindAllQueryDto, EditGroupDto } from "./dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("groups")
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAllGroups(@Query() query: FindAllQueryDto) {
    return await this.groupsService.findAll(query);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get(":id")
  async findGroupById(@Query("id") id: number) {
    return await this.groupsService.find(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get(":id")
  async deleteGroup(@Query("id") id: number) {
    return await this.groupsService.delete(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async createGroup(@Body() dto: CreateGroupDto) {
    return await this.groupsService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor("document"))
  @Patch(":id")
  async editGroup(
    @Body() dto: EditGroupDto,
    @Param("id") id: number,
    @Query("notification") notification: boolean,
    @UploadedFile() document: Express.Multer.File,
  ) {
    return await this.groupsService.edit(id, dto, notification, document);
  }
}
