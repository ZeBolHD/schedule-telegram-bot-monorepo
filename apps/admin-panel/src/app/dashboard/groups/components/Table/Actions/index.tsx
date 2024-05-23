import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Row } from "@tanstack/react-table";

import { Group } from "@/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import GroupDeleteModal from "./GroupDeleteModal";
import GroupEditModal from "./GroupEditModal";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface GroupCellActionsProps {
  row: Row<Group>;
}

const GroupCellActions = ({ row }: GroupCellActionsProps) => {
  const [dialog, setDialog] = useState<"edit" | "delete" | undefined>();

  const group = row.original;

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
        {dialog === "edit" && <GroupEditModal group={group} />}
        {dialog === "delete" && <GroupDeleteModal id={group.id} code={group.code} />}
      </DialogContent>
    </Dialog>
  );
};

export default GroupCellActions;
