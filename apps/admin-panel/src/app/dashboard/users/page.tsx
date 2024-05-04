"use client";

import { useEffect, useState } from "react";

import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorFetchBlock from "@/components/ErrorBlock";
import { FullTelegramUserType } from "@/types";

import UserTable from "./components/Table";

import { useSession } from "next-auth/react";
import getAllTelegramUsers from "@/actions/getAllTelegramUsers";

const UsersPage = () => {
  const [users, setUsers] = useState<FullTelegramUserType[] | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const session = useSession();

  const fetchUsers = async () => {
    const accessToken = session.data?.accessToken;

    if (!accessToken) return;

    setIsLoading(true);

    const users = await getAllTelegramUsers(accessToken);
    setUsers(users);
    setIsLoading(false);
  };

  useEffect(() => {
    if (session.data?.accessToken) {
      fetchUsers();
    }
  }, [session.data?.accessToken]);

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
