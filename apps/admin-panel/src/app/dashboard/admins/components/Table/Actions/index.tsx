import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Admin } from "@/types";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import AdminDeleteModal from "./AdminDeleteModal";

interface AdminCellActionsProps {
  row: Row<Admin>;
}

const AdminCellActions = ({ row }: AdminCellActionsProps) => {
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DialogTrigger asChild>
            <DropdownMenuItem className="cursor-pointer">Удалить</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="text-black">
        <AdminDeleteModal id={row.original.id} name={row.original.name} />
      </DialogContent>
    </Dialog>
  );
};

export default AdminCellActions;
