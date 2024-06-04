import { ColumnDef } from "@tanstack/react-table";

import { Teacher } from "@/types";

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
