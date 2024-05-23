"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import deleteGroup from "@/actions/deleteGroup";
import LoadingSpinner from "@/components/LoadingSpinner";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface GroupDeleteModal {
  id: number;
  code: string;
}

const GroupDeleteModal = ({ id, code }: GroupDeleteModal) => {
  const session = useSession();

  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (id: number) => deleteGroup(id, session.data?.accessToken!),
    onSuccess: () => {
      queryClient.refetchQueries(["groups"]);
    },
  });

  const onGroupDelete = async () => {
    const status = await mutateAsync(id);

    if (status === 200) {
      queryClient.refetchQueries(["groups"]);
      toast.success(`Группа ${code} успешно удалена`);
      document.getElementById("closeDialog")?.click();
      return;
    }

    toast.error("Что-то пошло не так");
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Удаление группы</DialogTitle>
      </DialogHeader>

      <p className="mt-5">Вы уверены, что хотите удалить группу {code}?</p>

      <DialogFooter className="justify-end">
        <Button variant="destructive" className="mt-5" disabled={isLoading} onClick={onGroupDelete}>
          {isLoading ? <LoadingSpinner size={20} /> : "Удалить"}
        </Button>
        <DialogClose id="closeDialog" />
      </DialogFooter>
    </div>
  );
};

export default GroupDeleteModal;
