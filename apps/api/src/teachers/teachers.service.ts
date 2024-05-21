import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { CreateTeacherDto, FindAllQueryDto } from "./dto";

@Injectable()
export class TeachersService {
  private logger = new Logger(TeachersService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query: FindAllQueryDto) {
    this.logger.log(`Finding all teachers`);
    const teachersExists = await this.prismaService.teacher.findMany({
      skip: query.page * query.pageSize - query.pageSize,
      take: query.pageSize,
      where: {
        departmentId: query.departmentId,
      },
      orderBy: {
        createdAt: query.createdAt,
      },
      select: {
        id: true,
        name: true,
        place: true,
        contact: true,
        departmentId: true,
        department: true,
        createdAt: true,
      },
    });

    const count = await this.prismaService.teacher
      .aggregate({
        _count: true,
        where: {
          departmentId: query.departmentId,
        },
      })
      .then((res) => res._count)
      .catch(() => 0);

    const teachers = teachersExists.map((teacher) => ({
      id: teacher.id,
      name: teacher.name,
      place: teacher.place,
      contact: teacher.contact,
      departmentId: teacher.departmentId,
      departmentName: teacher.department.name,
      createdAt: teacher.createdAt,
    }));

    const pageCount = Math.ceil(count / query.pageSize);

    this.logger.log(`Found ${count} groups`);

    return { teachers, count, page: query.page, pageSize: query.pageSize, pageCount };
  }

  async findOne(id: number) {
    this.logger.log(`Finding teacher ${id}`);

    const teachersExists = await this.prismaService.teacher.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        place: true,
        contact: true,
        departmentId: true,
        department: true,
      },
    });

    if (!teachersExists) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }

    this.logger.log(`Found teacher ${id}`);

    const teacher = {
      id: teachersExists.id,
      name: teachersExists.name,
      place: teachersExists.place,
      contact: teachersExists.contact,
      departmentId: teachersExists.departmentId,
      departmentName: teachersExists.department.name,
    };

    return teacher;
  }

  async create(teacher: CreateTeacherDto) {
    this.logger.log(`Creating teacher ${teacher.name}`);

    const teachersExists = await this.prismaService.teacher.findUnique({
      where: {
        name: teacher.name,
      },
    });

    if (teachersExists) {
      throw new ConflictException("Teacher already exists");
    }

    const createdTeacher = await this.prismaService.teacher.create({ data: teacher }).catch((e) => {
      this.logger.error(`Failed to create teacher ${teacher.name}`);
      this.logger.error(e);
      throw new BadRequestException(`Failed to create teacher ${teacher.name}`);
    });

    this.logger.log(`Created teacher ${teacher.name}`);

    return createdTeacher;
  }

  async delete(id: number) {
    this.logger.log(`Deleting teacher ${id}`);

    const teacher = await this.prismaService.teacher.findUnique({ where: { id } });

    if (!teacher) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }

    const deletedTeacher = await this.prismaService.teacher
      .delete({
        where: { id },
      })
      .catch((e) => {
        this.logger.error(`Failed to delete teacher ${id}`);
        this.logger.error(e);
        throw new BadRequestException(`Failed to delete teacher ${id}`);
      });

    this.logger.log(`Deleted teacher ${id}`);

    return deletedTeacher;
  }

  async edit(id: number, teacher: CreateTeacherDto) {
    this.logger.log(`Editing teacher ${id}`);

    const teachersExists = await this.prismaService.teacher.findUnique({
      where: {
        name: teacher.name,
      },
    });

    if (!teachersExists) {
      throw new NotFoundException("Teacher not found");
    }

    const editedTeacher = await this.prismaService.teacher
      .update({
        where: { id },
        data: teacher,
      })
      .catch((e) => {
        this.logger.error(`Failed to edit teacher ${id}`);
        this.logger.error(e);
        throw new BadRequestException(`Failed to edit teacher ${id}`);
      });

    this.logger.log(`Edited teacher ${id}`);

    return editedTeacher;
  }
}
