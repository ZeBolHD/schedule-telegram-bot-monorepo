import { ColumnDef } from "@tanstack/react-table";

import { Admin } from "@/types";
import AdminCellActions from "./Actions";

const columns: ColumnDef<Admin>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Имя пользователя",
    cell: ({ row }) => <div className="text-center">{row.original.name}</div>,
  },
  {
    accessorKey: "role",
    header: "Роль",
    cell: ({ row }) => <div className="text-center">{row.original.role}</div>,
  },

  {
    accessorKey: "actions",
    header: "",
    cell: AdminCellActions,
  },
];

export default columns;
