import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Row } from "@tanstack/react-table";

import { Teacher } from "@/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TeacherEditModal from "./TeacherEditModal";
import TeacherDeleteModal from "./TeacherDeleteModal";

interface TeacherCellActionsProps {
  row: Row<Teacher>;
}

const TableCellActions = ({ row }: TeacherCellActionsProps) => {
  const [dialog, setDialog] = useState<"edit" | "delete" | undefined>();

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Открыть меню</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DialogTrigger asChild>
            <DropdownMenuItem onClick={() => setDialog("edit")}>Изменить</DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild>
            <DropdownMenuItem onClick={() => setDialog("delete")}>Удалить</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="text-black">
        {dialog === "edit" && <TeacherEditModal teacher={row.original} />}
        {dialog === "delete" && (
          <TeacherDeleteModal id={row.original.id} name={row.original.name} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TableCellActions;
