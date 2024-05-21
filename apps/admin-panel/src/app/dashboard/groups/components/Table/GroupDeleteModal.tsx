"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import deleteGroup from "@/actions/deleteGroup";
import LoadingSpinner from "@/components/LoadingSpinner";
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface GroupDeleteModal {
  id: number;
  code: string;
  onClose: () => void;
}

const GroupDeleteModal = ({ id, code, onClose }: GroupDeleteModal) => {
  const [isLoading, setIsLoading] = useState(false);

  const session = useSession();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: number) => deleteGroup(id, session.data?.accessToken!),
    onSuccess: () => {
      queryClient.refetchQueries(["groups"]);
    },
  });

  const onGroupDelete = async () => {
    try {
      setIsLoading(true);
      await mutation.mutateAsync(id);

      onClose();
      setIsLoading(false);
      queryClient.refetchQueries(["groups"]);
      toast.success(`Группа ${code} успешно удалена`);
    } catch (e) {
      setIsLoading(false);
      toast.error("Что-то пошло не так");
    }
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Удаление группы</DialogTitle>
      </DialogHeader>

      <p className="mt-5">Вы уверены, что хотите удалить группу {code}?</p>

      <DialogFooter className="justify-end">
        <Button variant="destructive" className="ml-5" disabled={isLoading} onClick={onGroupDelete}>
          {isLoading ? <LoadingSpinner size={20} /> : "Удалить"}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default GroupDeleteModal;
