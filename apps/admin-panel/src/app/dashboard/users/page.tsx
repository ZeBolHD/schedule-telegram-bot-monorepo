"use client";

import { useQuery } from "react-query";
import { useSession } from "next-auth/react";

import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorFetchBlock from "@/components/ErrorBlock";

import UserTable from "./components/Table";

import getAllTelegramUsers from "@/actions/getAllTelegramUsers";

const UsersPage = () => {
  const session = useSession();

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery(
    ["telegramUsers", session.data?.accessToken],
    () => getAllTelegramUsers(session.data?.accessToken!),
    {
      enabled: !!session.data?.accessToken,
    },
  );
  if (isLoading) {
    return <LoadingSpinner size={100} />;
  }

  if (!users || !session.data?.accessToken) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <ErrorFetchBlock onRefetch={refetch} />
      </div>
    );
  }

  return (
    <div className="w-full h-full p-10">
      <UserTable users={users} />
    </div>
  );
};

export default UsersPage;
