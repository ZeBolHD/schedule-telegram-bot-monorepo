import { PrismaService } from "@/prisma/prisma.service";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async getScheduleFiles(userId: number) {
    this.logger.log(`Getting schedule files for user with id:${userId}`);
    const groups = await this.prismaService.userWithGroup.findMany({
      where: { userId: String(userId) },
      include: { group: true },
    });

    const scheduleFilesWithGroups = groups.map((group) => {
      return {
        fileId: group.group.fileId,
        groupCode: group.group.code,
      };
    });

    return scheduleFilesWithGroups;
  }
}
