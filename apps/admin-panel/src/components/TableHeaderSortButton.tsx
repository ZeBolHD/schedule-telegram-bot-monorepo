import { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "./ui/button";

interface TableHeaderSortButtonProps {
  name: string;
  column: Column<any>;
}

const TableHeaderSortButton = ({
  column,
  name,
}: TableHeaderSortButtonProps) => {
  return (
    <Button
      variant="ghost"
      className="w-full"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {name}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

export default TableHeaderSortButton;
