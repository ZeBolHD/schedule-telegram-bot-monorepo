import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class FindAllQueryDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "Поле departmentId должно быть числом" })
  @Min(1, { message: "Поле departmentId должно быть больше нуля" })
  departmentId: number;

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
  @IsString({ message: "Поле createdAt должно быть строкой" })
  createdAt: "asc" | "desc" = "asc";
}
