import { Injectable, Logger } from "@nestjs/common";
import { AdminUser } from "@repo/database";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async findOne(nameOrId: string): Promise<AdminUser | null> {
    this.logger.log(`Finding user ${nameOrId}`);

    const user = await this.prismaService.adminUser
      .findFirst({
        where: {
          OR: [{ id: nameOrId }, { name: nameOrId }],
        },
      })
      .catch(() => {
        this.logger.error("Failed to find user");

        return null;
      });

    if (!user) {
      this.logger.error("User not found");
      return null;
    }

    this.logger.log(`Found user ${user?.name}`);

    return user;
  }
}
