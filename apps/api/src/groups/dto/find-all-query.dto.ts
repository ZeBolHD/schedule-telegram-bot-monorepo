import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class FindAllQueryDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "Поле page должно быть числом" })
  @Min(1, { message: "Поле page должно быть больше нуля" })
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "Поле pageSize должно быть числом" })
  @Min(1, { message: "Поле pageSize должно быть больше нуля" })
  pageSize: number = 10;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "Поле studyType должно быть числом" })
  @Min(0, { message: "Поле studyType должно быть 0 или 1" })
  @Max(1, { message: "Поле studyType должно быть 0 или 1" })
  studyType: number = 0;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "Поле facultyId должно быть числом" })
  @Min(1, { message: "Поле facultyId должно быть больше нуля" })
  facultyId: number;

  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber({}, { message: "Поле grade должно быть числом" })
  @Min(1, { message: "Поле grade должно быть больше нуля" })
  grade: number;

  @IsOptional()
  @IsString({ message: "Поле userCountSort должно быть строкой" })
  userCountSort: "asc" | "desc" = "asc";
}
