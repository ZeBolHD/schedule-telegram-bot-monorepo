import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateGroupDto {
  @IsString({ message: "Поле code должно быть строкой" })
  code: string;

  @IsNumber({}, { message: "Поле grade должно быть числом" })
  grade: number;

  @IsNumber({}, { message: "Поле grade должно быть числом" })
  @Max(2, { message: "Поле studyType может иметь значение 0 или 1" })
  @Min(0, { message: "Поле studyType может иметь значение 0 или 1" })
  studyType: number;

  @IsNumber({}, { message: "Поле facultyId должно быть числом" })
  facultyId: number;

  @IsOptional()
  @IsString({ message: "Поле fileId должно быть строкой" })
  fileId?: string;
}
