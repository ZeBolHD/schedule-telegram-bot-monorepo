import { Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";

@Injectable()
export class DepartmentsService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.department.findMany();
  }

  findOne(id: number) {
    return this.prismaService.department.findUnique({ where: { id } });
  }
}
