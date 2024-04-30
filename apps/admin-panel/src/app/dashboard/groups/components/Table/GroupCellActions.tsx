import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Row } from "@tanstack/react-table";

import { FullGroupType } from "@/types";
import useModal from "@/hooks/useModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";

import GroupDeleteModal from "./GroupDeleteModal";
import GroupEditModal from "./GroupEditModal";

interface GroupCellActionsProps {
  row: Row<FullGroupType>;
}

const GroupCellActions = ({ row }: GroupCellActionsProps) => {
  const { isModalOpen, toggleModal } = useModal();
  const [modalAction, setModalAction] = useState<"edit" | "delete">("edit");

  const group = row.original;

  const openEditModal = () => {
    setModalAction("edit");
    toggleModal();
  };

  const openDeleteModal = () => {
    setModalAction("delete");
    toggleModal();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Открыть меню</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={openEditModal}>Изменить</DropdownMenuItem>
          <DropdownMenuItem onClick={openDeleteModal}>Удалить</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        {modalAction === "edit" ? (
          <GroupEditModal group={group} onClose={toggleModal} />
        ) : (
          <GroupDeleteModal
            id={group.id}
            code={group.code}
            onClose={toggleModal}
          />
        )}
      </Modal>
    </>
  );
};

export default GroupCellActions;
