import { IsString } from "class-validator";

export class LoginDto {
  @IsString({ message: "Поле name должно быть строкой" })
  readonly name: string;

  @IsString({ message: "Поле password должно быть строкой" })
  readonly password: string;
}
