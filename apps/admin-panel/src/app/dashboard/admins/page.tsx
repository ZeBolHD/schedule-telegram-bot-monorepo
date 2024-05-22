"use client";

import getAllAdmins from "@/actions/getAllAdmins";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "react-query";
import AdminsTable from "./components/Table";
import LoadingSpinner from "@/components/LoadingSpinner";
import AdminCreate from "./components/AdminCreate";

const Admins = () => {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.data?.user.role !== "SUPER_ADMIN") {
      router.push("/dashboard");
    }
  }, [session.data?.user.role, router]);

  const { data: admins, isLoading } = useQuery(
    "adminUsers",
    () => getAllAdmins(session.data?.accessToken!),
    {
      enabled: !!session.data?.accessToken,
    },
  );

  if (isLoading) {
    return <LoadingSpinner size={100} />;
  }

  return (
    <div className="p-10">
      <div className="flex justify-end">
        <AdminCreate />
      </div>
      <div className="mt-10">
        <AdminsTable admins={admins || []} />
      </div>
    </div>
  );
};

export default Admins;
