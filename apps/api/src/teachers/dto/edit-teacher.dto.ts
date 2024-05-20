import { IsOptional, IsString } from "class-validator";

export class EditTeacherDto {
  @IsOptional()
  @IsString({ message: "Поле name должно быть строкой" })
  name: string;

  @IsOptional()
  @IsString({ message: "Поле place должно быть строкой" })
  place: string;

  @IsOptional()
  @IsString({ message: "Поле contact должно быть строкой" })
  contact: string;

  @IsOptional()
  @IsString({ message: "Поле departmentId должно быть строкой" })
  departmentId: string;
}
