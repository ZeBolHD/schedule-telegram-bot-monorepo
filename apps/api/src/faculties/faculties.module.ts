import { Module } from "@nestjs/common";
import { FacultiesService } from "./faculties.service";
import { FacultiesController } from "./faculties.controller";

@Module({
  providers: [FacultiesService],
  controllers: [FacultiesController],
})
export class FacultiesModule {}
