import { IsString, MinLength } from "class-validator";

export class CreateFacultyDto {
  @IsString({ message: "Поле name должно быть строкой" })
  @MinLength(3)
  name: string;
}
