import { BadRequestException, ConflictException, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { CreateGroupDto } from "./dto";
import { FindAllQueryDto } from "./dto/find-all-query.dto";

@Injectable()
export class GroupsService {
  private readonly logger = new Logger(GroupsService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query: FindAllQueryDto) {
    const groupsExists = await this.prismaService.group.findMany({
      skip: query.page * query.pageSize - query.pageSize,
      take: query.pageSize,
      where: {
        studyType: query.studyType,
        facultyId: query.facultyId,
        grade: query.grade,
      },
      select: {
        id: true,
        code: true,
        grade: true,
        studyType: true,
        facultyId: true,
        fileId: true,
        userWithGroup: {
          select: {
            userId: true,
          },
        },
      },
    });

    const groups = groupsExists.map((group) => ({
      id: group.id,
      code: group.code,
      grade: group.grade,
      studyType: group.studyType,
      facultyId: group.facultyId,
      userCount: group.userWithGroup.length,
    }));

    const count = groupsExists.length;
    const pageCount = Math.ceil(count / query.pageSize);

    return { groups, count, page: query.page, pageSize: query.pageSize, pageCount };
  }

  async find(id: number) {
    const group = await this.prismaService.group.findUnique({ where: { id } });

    return group;
  }

  async create(group: CreateGroupDto) {
    this.logger.log(`Creating group ${group.code}`);

    const existGroup = await this.prismaService.group
      .findUnique({
        where: {
          code: group.code,
        },
      })
      .catch((e) => {
        this.logger.error(`Failed to find group ${group.code}`);
        this.logger.error(e);
        return null;
      });

    if (existGroup) {
      this.logger.error(`Group with code ${group.code} already exists`);
      throw new ConflictException(`Group with code ${group.code} already exists`);
    }

    const createdGroup = await this.prismaService.group.create({ data: group }).catch((e) => {
      this.logger.error(`Failed to create group ${group.code}`);
      this.logger.error(e);

      throw new BadRequestException(`Failed to create group ${group.code}`);
    });

    this.logger.log(`Created group ${group.code}`);

    return createdGroup;
  }

  async delete(id: number) {
    const group = await this.prismaService.group.findUnique({ where: { id } });

    this.logger.log(`Deleting group ${id}`);

    if (!group) {
      this.logger.error(`Group with id ${id} not found`);
      throw new BadRequestException(`Group with id ${id} not found`);
    }

    const deletedGroup = await this.prismaService.group
      .delete({
        where: { id },
      })
      .catch((e) => {
        this.logger.error(`Failed to delete group ${id}`);
        this.logger.error(e);
        throw new BadRequestException(`Failed to delete group ${id}`);
      });

    this.logger.log(`Deleted group ${id}`);

    return deletedGroup;
  }
}
