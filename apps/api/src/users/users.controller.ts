import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { RolesGuard } from "@auth/guards/role.guard";
import { Roles } from "@common/decorators";
import { Role } from "@repo/database";

import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post("create")
  async createUser(@Body() dto: CreateUserDto) {
    return await this.userService.createUser(dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Delete(":id")
  async findOne(@Param("id") id: string) {
    return await this.userService.delete(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get("telegram")
  async findOneById() {
    return await this.userService.findAllTelegram();
  }
}
