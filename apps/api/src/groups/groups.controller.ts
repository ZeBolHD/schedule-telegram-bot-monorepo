import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { GroupsService } from "./groups.service";
import { RolesGuard } from "@auth/guards/role.guard";
import { Roles } from "@common/decorators";
import { Role } from "@repo/database";
import { FindAllQueryDto } from "./dto/find-all-query.dto";
import { CreateGroupDto } from "./dto";

@Controller("groups")
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )
  @Get()
  async findAllGroups(@Query() query: FindAllQueryDto) {
    const groups = await this.groupsService.findAll(query);

    return groups;
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get(":id")
  async findGroupById(@Query("id") id: number) {
    const group = await this.groupsService.find(id);

    return group;
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get(":id")
  async deleteGroup(@Query("id") id: number) {
    const group = await this.groupsService.delete(id);

    return group;
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async createGroup(@Body(new ValidationPipe()) dto: CreateGroupDto) {
    const group = await this.groupsService.create(dto);

    return group;
  }
}
