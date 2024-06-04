import { ROLE_KEY } from "@common/decorators";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<Role>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRole) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    switch (user.role) {
      case Role.SUPER_ADMIN:
        return true;
      case Role.ADMIN == requiredRole:
        return true;
      default:
        return false;
    }
  }
}
