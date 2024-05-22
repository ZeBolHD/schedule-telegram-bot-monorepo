import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { LoginDto } from "./dto";
import { compareSync } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { Tokens } from "./interfaces";
import { AdminUser, Token } from "@repo/database";
import { PrismaService } from "@prisma/prisma.service";
import { v4 } from "uuid";
import { add } from "date-fns";
import { convertToSecondsUtil } from "@common/utils";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private readonly EXPIRE_TIME = this.configService.get("JWT_EXP", "5m");

  async login(dto: LoginDto): Promise<Tokens & { user: Partial<AdminUser>; expiresIn: number }> {
    const user = await this.userService.findOne(dto.name);

    if (!user || !compareSync(dto.password, user.password)) {
      this.logger.error(`Failed to login user ${dto.name} with password ${dto.password}`);
      throw new UnauthorizedException("Неверный логин или пароль");
    }

    const { accessToken, refreshToken } = await this.generateTokens(user);

    const expiresIn = this.getExpireTime();

    this.logger.log(`User with name: ${user.name} logged in`);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
      expiresIn,
    };
  }

  async refreshTokens(refreshToken: string): Promise<Tokens> {
    const token = await this.prismaService.token.findUnique({
      where: {
        token: refreshToken,
      },
    });

    if (!token) {
      throw new UnauthorizedException();
    }

    await this.prismaService.token.delete({
      where: {
        token: refreshToken,
      },
    });

    if (token.exp < new Date()) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOne(+token.userId);

    return this.generateTokens(user);
  }

  private async generateTokens(user: AdminUser): Promise<Tokens> {
    const accessToken = this.jwtService.sign({
      id: user.id,
      name: user.name,
      role: user.role,
    });

    const refreshToken = await this.getRefreshToken(user.id);

    this.logger.log(`Generated tokens for user with name: ${user.name}`);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async getRefreshToken(userId: number): Promise<Token> {
    const _token = await this.prismaService.token.findFirst({
      where: {
        userId,
      },
    });

    const token = _token?.token ?? "";

    return this.prismaService.token.upsert({
      where: { token },
      update: {
        token: v4(),
        exp: add(new Date(), { months: 1 }),
      },
      create: {
        token: v4(),
        exp: add(new Date(), { months: 1 }),
        userId,
      },
    });
  }

  getExpireTime(): number {
    const milliseconds = convertToSecondsUtil(this.EXPIRE_TIME) * 1000;
    const time = new Date().setTime(new Date().getTime() + milliseconds);
    return time;
  }
}
