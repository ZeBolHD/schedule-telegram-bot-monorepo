"use client";

import { useQuery } from "react-query";
import { ColumnFiltersState, Updater } from "@tanstack/react-table";
import { Faculty } from "@repo/database";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import getAllFaculties from "@/actions/getAllFaculties";
import { GetAllGroupsQuery, GroupFiltersType } from "@/types";
import { Dispatch } from "react";
import { useSession } from "next-auth/react";

interface GroupFiltersProps {
  setGroupsQuery: Dispatch<Updater<GetAllGroupsQuery>>;
}

const GroupFilters = ({ setGroupsQuery }: GroupFiltersProps) => {
  const session = useSession();

  const { data: faculties, isLoading } = useQuery(
    "faculties",
    () => getAllFaculties(session.data?.accessToken!),
    {
      enabled: !!session.data?.accessToken,
    },
  );

  const changeFacultyFilter = (facultyId: string) => {
    setGroupsQuery((prev) => ({
      ...prev,
      facultyId: facultyId === "None" ? undefined : Number(facultyId),
    }));
  };

  const changeStudyTypeFilter = (studyType: string) => {
    setGroupsQuery((prev) => ({
      ...prev,
      studyType: studyType === "None" ? undefined : Number(studyType),
    }));
  };

  const changeGradeFilter = (grade: string) => {
    setGroupsQuery((prev) => ({ ...prev, grade: grade === "None" ? undefined : Number(grade) }));
  };

  if (!faculties || isLoading) {
    return null;
  }

  return (
    <div className=" text-black ml-0 mr-auto flex text-center">
      <div className="w-80">
        <Select onValueChange={changeFacultyFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Факультет" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Факультеты</SelectLabel>
              <SelectItem value="None" className="cursor-pointer">
                Любой
              </SelectItem>
              {faculties.map((faculty) => (
                <SelectItem key={faculty.id} value={String(faculty.id)} className="cursor-pointer">
                  {faculty.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="w-48 ml-5">
        <Select onValueChange={changeStudyTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Форма обучения" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Форма обучения</SelectLabel>
              <SelectItem value="None" className="cursor-pointer">
                Любая
              </SelectItem>
              <SelectItem value="0" className="cursor-pointer">
                Очная
              </SelectItem>
              <SelectItem value="1" className="cursor-pointer">
                Заочная
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="w-32 ml-5">
        <Select onValueChange={changeGradeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Курс" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Курс</SelectLabel>
              <SelectItem value="None" className="cursor-pointer">
                Любой
              </SelectItem>
              <SelectItem value="1" className="cursor-pointer">
                1
              </SelectItem>
              <SelectItem value="2" className="cursor-pointer">
                2
              </SelectItem>
              <SelectItem value="3" className="cursor-pointer">
                3
              </SelectItem>
              <SelectItem value="4" className="cursor-pointer">
                4
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default GroupFilters;
