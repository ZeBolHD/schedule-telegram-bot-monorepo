import { Transform } from "class-transformer";
import { IsArray, IsNumber } from "class-validator";

export class UpdateScheduleDto {
  @Transform(({ value }) => JSON.parse(value))
  @IsArray({ message: "Поле groupIds должно быть массивом" })
  @IsNumber({}, { message: "Поле groupIds должно быть массивом чисел", each: true })
  groupIds: number[];
}
