import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SendNewsDto {
  @IsString({ message: "Поле heading должно быть строкой" })
  @IsNotEmpty({ message: "Поле heading не может быть пустым" })
  heading: string;

  @IsString({ message: "Поле text должно быть строкой" })
  @IsNotEmpty({ message: "Поле text не может быть пустым" })
  text: string;

  @IsOptional()
  images: Blob[];
}
