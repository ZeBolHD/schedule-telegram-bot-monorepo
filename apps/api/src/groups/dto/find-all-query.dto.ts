import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class FindAllQueryDto {
  @IsOptional()
  @IsNumber({}, { message: "Поле page должно быть числом" })
  @Min(1, { message: "Поле page должно быть больше нуля" })
  page: number = 1;

  @IsOptional()
  @IsNumber({}, { message: "Поле pageSize должно быть числом" })
  @Min(1, { message: "Поле pageSize должно быть больше нуля" })
  pageSize: number = 10;

  @IsOptional()
  @IsNumber({}, { message: "Поле studyType должно быть числом" })
  @Min(0, { message: "Поле studyType должно быть 0 или 1" })
  @Max(1, { message: "Поле studyType должно быть 0 или 1" })
  studyType: number = 0;

  @IsOptional()
  @IsNumber({}, { message: "Поле facultyId должно быть числом" })
  @Min(1, { message: "Поле facultyId должно быть больше нуля" })
  facultyId: number;

  @IsOptional()
  @IsNumber({}, { message: "Поле grade должно быть числом" })
  @Min(1, { message: "Поле grade должно быть больше нуля" })
  grade: number;
}
