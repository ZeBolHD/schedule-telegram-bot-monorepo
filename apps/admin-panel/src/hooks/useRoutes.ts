import { BellRing, BookUser, File, UserRound, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const useRoutes = () => {
  const pathname = usePathname();

  const isSuperAdmin = useSession().data?.user.role === "SUPER_ADMIN";

  const routes = useMemo(() => {
    return [
      {
        label: "Пользователи",
        href: "/dashboard/users",
        icon: UserRound,
        active: pathname === "/dashboard/users",
      },
      {
        label: "Группы",
        href: "/dashboard/groups",
        icon: Users,
        active: pathname === "/dashboard/groups",
      },
      {
        label: "Уведомления",
        href: "/dashboard/notifications",
        icon: BellRing,
        active: pathname === "/dashboard/notifications",
      },
      {
        label: "Преподаватели",
        href: "/dashboard/teachers",
        icon: BookUser,
        active: pathname === "/dashboard/teachers",
      },
      {
        label: "Документы",
        href: "/dashboard/documents",
        icon: File,
        active: pathname === "/dashboard/documents",
      },
    ].concat(
      !isSuperAdmin
        ? []
        : [
            {
              label: "Администраторы",
              href: "/dashboard/admins",
              icon: Users,
              active: pathname === "/dashboard/admins",
            },
          ],
    );
  }, [pathname, isSuperAdmin]);

  return routes;
};

export default useRoutes;
