import { BadRequestException, ConflictException, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { CreateFacultyDto } from "./dto";

@Injectable()
export class FacultiesService {
  private readonly logger = new Logger(FacultiesService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    this.logger.log(`Fetching all faculties`);
    const faculties = await this.prismaService.faculty.findMany().catch((e) => {
      this.logger.error(`Failed to fetch all faculties`);
      this.logger.error(e);
      return [];
    });

    this.logger.log(`Found ${faculties.length} faculties`);

    return faculties;
  }

  async find(id: number) {
    this.logger.log(`Fetching faculty ${id}`);
    const faculty = await this.prismaService.faculty.findUnique({ where: { id } }).catch((e) => {
      this.logger.error(`Failed to fetch faculty ${id}`);
      this.logger.error(e);
      return null;
    });

    if (!faculty) {
      this.logger.error(`Failed to fetch faculty ${id}`);
      return null;
    }

    this.logger.log(`Found faculty ${id}`);

    return faculty;
  }

  async create(faculty: CreateFacultyDto) {
    this.logger.log(`Creating faculty ${faculty.name}`);

    const facultyExists = await this.prismaService.faculty
      .findFirst({
        where: {
          name: faculty.name,
        },
      })
      .catch((e) => {
        this.logger.error(`Failed to find faculty ${faculty.name}`);
        this.logger.error(e);

        throw new BadRequestException(`Failed to find faculty ${faculty.name}`);
      });

    if (facultyExists) {
      throw new ConflictException(`Faculty ${faculty.name} already exists`);
    }

    const createdFaculty = await this.prismaService.faculty.create({ data: faculty }).catch((e) => {
      this.logger.error(`Failed to create faculty ${faculty.name}`);
      this.logger.error(e);
      throw new BadRequestException(`Failed to create faculty ${faculty.name}`);
    });

    if (!createdFaculty) {
      this.logger.error(`Failed to create faculty ${faculty.name}`);
      throw new BadRequestException(`Failed to create faculty ${faculty.name}`);
    }

    this.logger.log(`Created faculty ${createdFaculty.name}`);

    return createdFaculty;
  }

  async delete(id: number) {
    this.logger.log(`Deleting faculty ${id}`);

    const faculty = await this.prismaService.faculty
      .findUnique({
        where: { id },
      })
      .catch((e) => {
        this.logger.error(`Failed to find faculty ${id}`);
        this.logger.error(e);
        throw new BadRequestException(`Failed to find faculty ${id}`);
      });

    if (!faculty) {
      this.logger.error(`Failed to find faculty ${id}`);
      throw new BadRequestException(`Failed to find faculty ${id}`);
    }

    const deletedFaculty = await this.prismaService.faculty
      .delete({
        where: { id },
        select: { id: true, name: true },
      })
      .catch((e) => {
        this.logger.error(`Failed to delete faculty ${id}`);
        this.logger.error(e);
        throw new BadRequestException(`Failed to delete faculty ${id}`);
      });

    if (!deletedFaculty) {
      this.logger.error(`Failed to delete faculty ${id}`);
      throw new BadRequestException(`Failed to delete faculty ${id}`);
    }

    this.logger.log(`Deleted faculty ${deletedFaculty.name}`);

    return deletedFaculty;
  }
}
