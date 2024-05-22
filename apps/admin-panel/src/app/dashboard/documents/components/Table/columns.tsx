import { ColumnDef } from "@tanstack/react-table";

import { DocumentCategoryWithDocuments } from "@/types";
import DocumentCategoryCellActions from "./DocumentCategoryCellActions";

const columns: ColumnDef<DocumentCategoryWithDocuments>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Категория",
  },
  {
    accessorKey: "documents",
    header: "Документы",
    cell: ({ row }) => {
      return <div>{row.original.documents.length}</div>;
    },
  },

  {
    accessorKey: "actions",
    header: "",
    cell: DocumentCategoryCellActions,
  },
];

export default columns;
