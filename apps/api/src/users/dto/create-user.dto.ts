import { Role } from "@repo/database";
import { IsEnum, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString({ message: "Поле name должно быть строкой" })
  name: string;

  @IsString({ message: "Поле password должно быть строкой" })
  @MinLength(8, { message: "Поле password должно содержать не менее 8 символов" })
  password: string;

  @IsString({ message: "Поле role должно быть строкой" })
  @IsEnum(Role, {
    message: "Поле role должно быть одним из значений: " + Object.values(Role).join(", "),
  })
  role: Role;
}
