import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { FacultiesService } from "./faculties.service";
import { RolesGuard } from "@auth/guards/role.guard";
import { Roles } from "@common/decorators";
import { Role } from "@repo/database";
import { CreateFacultyDto } from "./dto";

@Controller("faculties")
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAllFaculties() {
    const faculties = await this.facultiesService.findAll();

    return faculties;
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async createFaculty(@Body() dto: CreateFacultyDto) {
    const faculty = await this.facultiesService.create(dto);

    return faculty;
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get(":id")
  async getFaculty(@Body("id") id: number) {
    const faculty = await this.facultiesService.find(id);

    return faculty;
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(":id")
  async deleteFaculty(@Param("id") id: number) {
    const faculty = await this.facultiesService.delete(id);

    return faculty;
  }
}
