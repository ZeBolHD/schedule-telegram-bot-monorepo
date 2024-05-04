import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { CreateGroupDto, UpdateScheduleDto } from "./dto";
import { FindAllQueryDto } from "./dto/find-all-query.dto";
import { NotificationsService } from "src/notifications/notifications.service";
import { BotService } from "src/bot/bot.service";

@Injectable()
export class GroupsService {
  private readonly logger = new Logger(GroupsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationsService,
    private readonly botService: BotService,
  ) {}

  async findAll(query: FindAllQueryDto) {
    this.logger.log(`Finding all groups`);

    console.log(query);

    const groupsExists = await this.prismaService.group.findMany({
      skip: query.page * query.pageSize - query.pageSize,
      take: query.pageSize,
      where: {
        studyType: query.studyType,
        facultyId: query.facultyId,
        grade: query.grade,
      },
      orderBy: { userWithGroup: { _count: query.userCountSort } },
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

    this.logger.log(`Found ${count} groups`);

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

  async edit(
    id: number,
    group: CreateGroupDto,
    notification: boolean,
    scheduleFile?: Express.Multer.File,
  ) {
    this.logger.log(`Editing group with id:${id}`);

    const existGroup = await this.prismaService.group
      .findFirst({
        where: {
          code: group.code,
        },
      })
      .catch((e) => {
        this.logger.error(`Failed to find group ${group.code}`);
        this.logger.error(e);
        throw new NotFoundException(`Group with code ${group.code} not found`);
      });

    if (!existGroup) {
      this.logger.error(`Failed to find group ${group.code}`);
      throw new NotFoundException(`Group with code ${group.code} not found`);
    }

    let documentId: string | null = null;

    if (scheduleFile) {
      const fileId = await this.botService.getDocumentId(scheduleFile);
      documentId = fileId;
    }

    const updatedGroup = await this.prismaService.group
      .update({
        where: { id },
        data: {
          code: group.code,
          grade: group.grade,
          studyType: group.studyType,
          facultyId: group.facultyId,
          fileId: documentId,
        },
      })
      .catch((e) => {
        this.logger.error(`Failed to update group with id:${id}`);
        this.logger.error(e);
        throw new BadRequestException(`Failed to update group with id:${id}`);
      });

    this.logger.log(`Edited group ${id}`);

    if (notification && documentId) {
      await this.notificationService.sendScheduleNotificationToGroup(updatedGroup.id, documentId);
    }

    return updatedGroup;
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

  async updateSchedule(
    dto: UpdateScheduleDto,
    notification: boolean,
    scheduleFile: Express.Multer.File,
  ) {
    this.logger.log(`Updating schedule for groups ${dto.groupIds.join(",")}`);

    const groups = await this.prismaService.group
      .findMany({
        where: {
          id: {
            in: dto.groupIds,
          },
        },
      })
      .catch((e) => {
        this.logger.error(`Failed to find groups ${dto.groupIds.join(",")}`);
        this.logger.error(e);
        throw new BadRequestException(`Failed to find groups ${dto.groupIds.join(",")}`);
      });

    if (groups.length !== dto.groupIds.length) {
      this.logger.error(`Failed to find groups ${dto.groupIds.join(",")}`);
      throw new BadRequestException(`Failed to find groups ${dto.groupIds.join(",")}`);
    }

    const documentId = await this.botService.getDocumentId(scheduleFile);

    await this.prismaService.group
      .updateMany({
        where: {
          id: {
            in: dto.groupIds,
          },
        },
        data: {
          fileId: documentId,
        },
      })
      .catch((e) => {
        this.logger.error(`Failed to update groups ${dto.groupIds.join(",")}`);
        this.logger.error(e);
        throw new BadRequestException(`Failed to update groups ${dto.groupIds.join(",")}`);
      });

    this.logger.log(`Updated schedule for groups ${dto.groupIds.join(",")}`);

    console.log(notification);

    if (notification) {
      for (const group of groups) {
        await this.notificationService.sendScheduleNotificationToGroup(group.id, documentId);
      }
    }

    return groups;
  }
}
