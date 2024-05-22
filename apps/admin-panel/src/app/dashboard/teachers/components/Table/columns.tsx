import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Faculty } from "@repo/database";

import { Group, Teacher } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import TableHeaderSortButton from "@/components/TableHeaderSortButton";

// import GroupCellActions from "./GroupCellActions";
import { API_URL } from "@/lib/consts";
import TableCellActions from "./Actions";

const columns: ColumnDef<Teacher>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <div className="w-full text-center">{column.id}</div>,
    cell: ({ row }) => <div className="text-center">{row.original.id}</div>,
    size: 30,
    maxSize: 30,
  },
  {
    accessorKey: "name",
    header: () => <div className="w-full text-center">ФИО</div>,
    cell: ({ row }) => <div className="text-center">{row.original.name}</div>,
  },
  {
    id: "departmentName",
    accessorKey: "departmentName",
    header: () => <div className="w-full text-center">Факультет</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.original.departmentName}</div>;
    },
  },
  {
    id: "place",
    accessorKey: "place",
    header: () => <div className="w-full text-center">Должность</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.original.place}</div>;
    },
  },
  {
    accessorKey: "contact",
    header: ({ column }) => <div className="w-full text-center">Контакт</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.contact ? row.original.contact : "-"}</div>
    ),
  },

  {
    id: "actions",
    enableSorting: false,
    cell: TableCellActions,
  },
];

export default columns;
