import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { TeachersService } from "./teachers.service";
import { RolesGuard } from "@auth/guards/role.guard";
import { Role } from "@repo/database";
import { Roles } from "@common/decorators";
import { CreateTeacherDto, FindAllQueryDto } from "./dto";

@Controller("teachers")
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll(@Query() query: FindAllQueryDto) {
    return this.teachersService.findAll(query);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.teachersService.findOne(+id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateTeacherDto) {
    return this.teachersService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.teachersService.delete(+id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(":id")
  edit(@Param("id") id: string, @Body() dto: CreateTeacherDto) {
    return this.teachersService.edit(+id, dto);
  }
}
