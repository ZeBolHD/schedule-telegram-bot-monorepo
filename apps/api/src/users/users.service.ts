import { BadRequestException, ConflictException, Injectable, Logger } from "@nestjs/common";
import { AdminUser } from "@repo/database";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async findOne(nameOrId: string): Promise<AdminUser | null> {
    // this.logger.log(`Finding user ${nameOrId}`);

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

    // this.logger.log(`Found user ${user?.name}`);

    return user;
  }

  async findAll(): Promise<Omit<AdminUser, "password">[]> {
    this.logger.log("Finding all users");

    const users = await this.prismaService.adminUser
      .findMany({
        select: {
          id: true,
          name: true,
          role: true,
          createdAt: true,
        },
      })
      .catch(() => {
        this.logger.error("Failed to find users");
        return [];
      });

    this.logger.log(`Found ${users.length} users`);

    return users;
  }

  async createUser(user: CreateUserDto) {
    this.logger.log(`Creating user ${user.name}`);

    const userExists = await this.prismaService.adminUser
      .findUnique({
        where: { name: user.name },
      })
      .catch(() => {
        this.logger.error("Failed to find user");
        throw new BadRequestException("Failed to find user");
      });

    if (userExists) {
      throw new ConflictException(`User ${user.name} already exists`);
    }

    const createdUser = await this.prismaService.adminUser
      .create({
        data: user,
        select: { id: true, name: true, role: true, createdAt: true },
      })
      .catch(() => {
        this.logger.error("Failed to create user");
        throw new BadRequestException("Failed to create user");
      });

    if (!createdUser) {
      this.logger.error("Failed to create user");
      throw new BadRequestException("Failed to create user");
    }

    this.logger.log(`Created user ${createdUser.name}`);

    return createdUser;
  }

  async delete(id: string) {
    this.logger.log(`Deleting user ${id}`);

    const user = await this.prismaService.adminUser
      .findUnique({
        where: { id },
      })
      .catch(() => {
        this.logger.error("Failed to find user");
        throw new BadRequestException("Failed to find user");
      });

    if (!user) {
      this.logger.error("Failed to find user");
      throw new BadRequestException("Failed to find user");
    }

    const deletedUser = await this.prismaService.adminUser
      .delete({
        where: { id },
        select: { id: true, name: true, role: true, createdAt: true },
      })
      .catch(() => {
        this.logger.error("Failed to delete user");
        throw new BadRequestException("Failed to delete user");
      });

    if (!deletedUser) {
      this.logger.error("Failed to delete user");
      throw new BadRequestException("Failed to delete user");
    }

    this.logger.log(`Deleted user ${deletedUser.name}`);

    return deletedUser;
  }

  async findAllTelegram() {
    this.logger.log("Finding all telegram users");

    const telegramUsers = await this.prismaService.telegramUser.findMany({
      include: {
        userWithGroup: {
          include: {
            group: true,
          },
        },
      },
    });

    const users = telegramUsers.map((telegramUser) => ({
      id: telegramUser.id,
      username: telegramUser.username,
      firstName: telegramUser.firstName,
      createdAt: telegramUser.createdAt,
      groups: telegramUser.userWithGroup.map((user) => user.group.code),
    }));

    this.logger.log(`Found ${telegramUsers.length} telegram users`);

    return users;
  }
}
