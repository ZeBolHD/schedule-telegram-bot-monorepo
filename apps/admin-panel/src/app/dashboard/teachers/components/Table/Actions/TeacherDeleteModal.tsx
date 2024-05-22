"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import deleteGroup from "@/actions/deleteGroup";
import LoadingSpinner from "@/components/LoadingSpinner";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import deleteTeacher from "@/actions/deleteTeacher";

interface TeacherDeleteModalProps {
  id: number;
  name: string;
}

const TeacherDeleteModal = ({ id, name }: TeacherDeleteModalProps) => {
  const session = useSession();

  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (id: number) => deleteTeacher(id, session.data?.accessToken!),
    onSuccess: () => {
      queryClient.refetchQueries(["teachers"]);
    },
  });

  const onGroupDelete = async () => {
    try {
      const status = await mutateAsync(id);

      if (!status) {
        toast.error("Что-то пошло не так");
        return;
      }

      if (status !== 200) {
        toast.error("Что-то пошло не так");
        return;
      }

      queryClient.refetchQueries(["groups"]);
      toast.success(`Преподаватель ${name} успешно удалён`);
      document.getElementById("closeDialog")?.click();
    } catch (e) {
      toast.error("Что-то пошло не так");
    }
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Удаление группы</DialogTitle>
      </DialogHeader>

      <p className="mt-5">Вы уверены, что хотите удалить преподавателя {name}?</p>

      <DialogFooter className="mt-5 justify-end">
        <Button variant="destructive" className="ml-5" disabled={isLoading} onClick={onGroupDelete}>
          {isLoading ? <LoadingSpinner size={20} /> : "Удалить"}
        </Button>
        <DialogClose id="closeDialog" />
      </DialogFooter>
    </div>
  );
};

export default TeacherDeleteModal;
