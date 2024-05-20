import { Teacher } from "@repo/database";
import { IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreateTeacherDto implements Omit<Teacher, "id" | "createdAt"> {
  @IsString({ message: "Поле name должно быть строкой" })
  @MinLength(3, { message: "Минимальная длина поля name 3 символа" })
  name: string;

  @IsString({ message: "Поле place должно быть строкой" })
  @MinLength(3, { message: "Минимальная длина поля place 3 символа" })
  place: string;

  @IsOptional()
  @IsString({ message: "Поле contact должно быть строкой" })
  @MinLength(3, { message: "Минимальная длина поля contact 3 символа" })
  contact: string;

  @IsNumber({}, { message: "Поле departmentId должно быть числом" })
  @Min(1, { message: "Поле departmentId должно быть больше 0" })
  departmentId: number;
}
