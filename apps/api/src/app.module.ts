import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "@auth/guards/auth.guard";
import { FacultiesModule } from "./faculties/faculties.module";
import { GroupsModule } from "./groups/groups.module";
import { NotificationsModule } from "./notifications/notifications.module";

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    FacultiesModule,
    GroupsModule,
    NotificationsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
