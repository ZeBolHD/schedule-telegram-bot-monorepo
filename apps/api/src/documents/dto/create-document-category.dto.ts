import { IsString, MinLength } from "class-validator";

export class CreateDocumentCategoryDto {
  @IsString({ message: "Поле name должно быть строкой" })
  @MinLength(3, { message: "Поле name должно содержать не менее 3 символов" })
  name: string;
}
