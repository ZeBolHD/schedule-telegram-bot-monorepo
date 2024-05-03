import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { FullTelegramUserType } from "@/types";
import { Button } from "@/components/ui/button";
import TableHeaderSortButton from "@/components/TableHeaderSortButton";

const columns: ColumnDef<FullTelegramUserType>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "firstName",
    header: "Имя",
  },
  { accessorKey: "username", header: "Имя пользователя" },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <TableHeaderSortButton column={column} name="Дата создания" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const dateString = date.toLocaleDateString();

      return <div>{dateString}</div>;
    },
  },
  {
    accessorKey: "userWithGroup",
    header: "Группы",
    cell: ({ row }) => {
      const groups = row.original.groups;
      return <div>{groups.join(", ")}</div>;
    },
  },
];

export default columns;
