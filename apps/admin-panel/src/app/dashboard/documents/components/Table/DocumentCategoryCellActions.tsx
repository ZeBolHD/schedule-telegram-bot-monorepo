"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocumentCategoryWithDocuments } from "@/types";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import DocumentCategoryDeleteModal from "./DocumentCategoryDeleteModal";
import DocumentCategoryEditModal from "./DocumentCategoryEditModal";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

interface DocumentCategoryCellActionsProps {
  row: Row<DocumentCategoryWithDocuments>;
}

const DocumentCategoryCellActions = ({ row }: DocumentCategoryCellActionsProps) => {
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
        {dialog === "edit" && <DocumentCategoryEditModal id={row.original.id} />}
        {dialog === "delete" && (
          <DocumentCategoryDeleteModal id={row.original.id} name={row.original.name} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentCategoryCellActions;
