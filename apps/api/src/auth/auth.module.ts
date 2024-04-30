import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersModule } from "src/users/users.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { options } from "./config/jwt-module-async-options";
import { STRATEGIES } from "./strategies";
import { GUARDS } from "./guards";

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  providers: [AuthService, ...STRATEGIES, ...GUARDS],
  imports: [UsersModule, PassportModule, JwtModule.registerAsync(options())],
})
export class AuthModule {}
