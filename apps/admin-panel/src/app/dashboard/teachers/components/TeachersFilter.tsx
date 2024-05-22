import getAllDepartments from "@/actions/getAllDepartments";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GetAllTeachersQuery } from "@/types";
import { Updater } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { Dispatch } from "react";
import { useQuery } from "react-query";

interface TeachersFiltersProps {
  setTeachersQuery: Dispatch<Updater<GetAllTeachersQuery>>;
}

const TeachersFilters = ({ setTeachersQuery }: TeachersFiltersProps) => {
  const session = useSession();
  const { data: departments } = useQuery(
    "departments",
    () => getAllDepartments(session.data?.accessToken!),
    {
      enabled: !!session.data?.accessToken,
    },
  );

  const changeDepartmentIdFilter = (departmentId: string) => {
    setTeachersQuery((prev) => ({
      ...prev,
      departmentId: departmentId === "None" ? undefined : Number(departmentId),
    }));
  };

  const changeCreatedAtFilter = (createdAt: "asc" | "desc" | "None") => {
    setTeachersQuery((prev) => ({
      ...prev,
      createdAt: createdAt === "None" ? undefined : createdAt,
    }));
  };

  return (
    <div className="text-black ml-0 mr-auto flex text-center gap-5">
      <div className="w-80">
        <Select onValueChange={changeDepartmentIdFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Кафедра" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="None">Любая</SelectItem>
            {departments?.map((department) => (
              <SelectItem key={department.id} value={department.id.toString()}>
                {department.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-36">
        <Select onValueChange={changeCreatedAtFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Создано" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="None">Любое</SelectItem>
            <SelectItem value="asc">Старые</SelectItem>
            <SelectItem value="desc">Новые</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TeachersFilters;
