import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto } from "./dto";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return {};
  }
}
