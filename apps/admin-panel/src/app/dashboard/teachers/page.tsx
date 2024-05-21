"use client";

import { getAllTeachers } from "@/actions/getAllTeachers";
import LoadingSpinner from "@/components/LoadingSpinner";
import { GetAllTeachersQuery } from "@/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useQuery } from "react-query";
import TeachersTable from "./components/Table";

const Teachers = () => {
  const [teachersQuery, setTeachersQuery] = useState<GetAllTeachersQuery>({
    page: 1,
    createdAt: "asc",
  });

  const session = useSession();
  const { data, isLoading } = useQuery(
    ["getAllTeachers", teachersQuery],
    () => getAllTeachers(teachersQuery, session.data?.accessToken!),
    {
      enabled: !!session.data?.accessToken,
      initialData: {
        teachers: [],
        departmentName: "",
        count: 0,
        page: 0,
        pageSize: 0,
        pageCount: 0,
      },
    },
  );

  const setPage = (page: number) => {
    setTeachersQuery((prev) => ({ ...prev, page }));
  };

  if (isLoading || !session.data?.accessToken) {
    return <LoadingSpinner size={100} />;
  }

  if (!data) {
    return <div>No data</div>;
  }

  return (
    <div className="w-full h-full p-10">
      <TeachersTable
        teachers={data.teachers}
        page={data.page}
        setPage={setPage}
        pageCount={data.pageCount}
      />
    </div>
  );
};

export default Teachers;
