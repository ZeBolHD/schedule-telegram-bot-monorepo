import { Injectable, Logger } from "@nestjs/common";
import { AdminUser } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async findUser(id: string): Promise<AdminUser | null> {
    this.logger.log(`Finding user ${id}`);

    const user = await this.prismaService.adminUser
      .findUnique({
        where: {
          id: id,
        },
      })
      .catch(() => {
        this.logger.error("Failed to find user");

        return null;
      });

    this.logger.log(`Found user ${user?.id}`);

    return user;
  }
}
