import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { LoginDto } from "./dto";
import { AuthService } from "./auth.service";
import { Public, Roles } from "@common/decorators";
import { Role } from "@repo/database";
import { RolesGuard } from "./guards/role.guard";
import { Tokens } from "./interfaces";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";

const REFRESH_TOKEN = "refresh_token";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post("login")
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const userWithTokens = await this.authService.login(loginDto);

    if (!userWithTokens) {
      throw new BadRequestException(
        `Не получается авторизоваться с данными ${JSON.stringify(loginDto)}`,
      );
    }

    const data = { ...userWithTokens, refreshToken: userWithTokens.refreshToken.token };
    this.setRefreshTokenToCookies(userWithTokens, res, data);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get("hello")
  getHello(): string {
    return "Hello World!";
  }

  private setRefreshTokenToCookies(tokens: Tokens, res: Response, data?: any) {
    if (!tokens) {
      throw new UnauthorizedException();
    }

    res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(tokens.refreshToken.exp),
      secure: this.configService.get("NODE_ENV", "development") === "production",
      path: "/",
    });

    if (data) {
      res.status(HttpStatus.CREATED).json({
        ...data,
      });
      return;
    }

    res.status(HttpStatus.CREATED).json({
      accessToken: tokens.accessToken,
    });
  }
}
