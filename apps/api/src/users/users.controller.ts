import { Body, Controller, Delete, Get, Post, UseGuards } from "@nestjs/common";
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
    const user = await this.userService.createUser(dto);

    return user;
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get()
  async findAll() {
    const users = this.userService.findAll();

    return users;
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Delete(":id")
  async findOne(@Body("id") id: string) {
    const user = await this.userService.delete(id);

    return user;
  }
}
