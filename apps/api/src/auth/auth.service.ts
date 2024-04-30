import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { LoginDto } from "./dto";
import { compareSync } from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userService.findUser(dto.name);

    if (!user || !compareSync(dto.password, user.password)) {
      this.logger.error(
        `Failed to login user ${dto.name} with password ${dto.password}`,
      );
      throw new UnauthorizedException("Неверный логин или пароль");
    }
  }
}
