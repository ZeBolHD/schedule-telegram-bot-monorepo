"use client";

import { useEffect, useState } from "react";

import getAllUsers from "@/actions/getAllUsers";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorFetchBlock from "@/components/ErrorBlock";
import { FullTelegramUserType } from "@/types";

import UserTable from "./components/Table";

import { useSession } from "next-auth/react";

const UsersPage = () => {
  const [users, setUsers] = useState<FullTelegramUserType[] | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const session = useSession();

  const fetchUsers = async () => {
    setIsLoading(true);

    const users = await getAllUsers(session.data?.accessToken!);
    setUsers(users);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [session]);

  if (isLoading) {
    return <LoadingSpinner size={100} />;
  }

  if (users === null || !session.data?.accessToken) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <ErrorFetchBlock onRefetch={fetchUsers} />
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
