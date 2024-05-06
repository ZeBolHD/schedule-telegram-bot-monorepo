import { ColumnDef } from "@tanstack/react-table";

import { TelegramUser } from "@/types";
import TableHeaderSortButton from "@/components/TableHeaderSortButton";

const columns: ColumnDef<TelegramUser>[] = [
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
