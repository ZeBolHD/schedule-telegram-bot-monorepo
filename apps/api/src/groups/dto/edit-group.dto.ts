import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class EditGroupDto {
  @IsOptional()
  @IsString({ message: "Поле code должно быть строкой" })
  code: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "Поле grade должно быть числом" })
  grade: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "Поле grade должно быть числом" })
  @Max(2, { message: "Поле studyType может иметь значение 0 или 1" })
  @Min(0, { message: "Поле studyType может иметь значение 0 или 1" })
  studyType: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "Поле facultyId должно быть числом" })
  facultyId: number;

  @IsOptional()
  @IsString({ message: "Поле fileId должно быть строкой" })
  fileId?: string;
}
