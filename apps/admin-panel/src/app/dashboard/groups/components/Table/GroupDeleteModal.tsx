"use client";

import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import deleteGroup from "@/actions/deleteGroup";
import LoadingSpinner from "@/components/LoadingSpinner";
import { TableGroupsDataContext } from "@/context/TableGroupsDataContext";

interface GroupDeleteModal {
  id: number;
  code: string;
  onClose: () => void;
}

const GroupDeleteModal = ({ id, code, onClose }: GroupDeleteModal) => {
  const [isLoading, setIsLoading] = useState(false);
  const { refetch } = useContext(TableGroupsDataContext);

  const onGroupDelete = async () => {
    try {
      setIsLoading(true);
      await deleteGroup(id);

      onClose();
      setIsLoading(false);
      refetch();
      toast.success(`Группа ${code} успешно удалена`);
    } catch (e) {
      setIsLoading(false);
      toast.error("Что-то пошло не так");
    }
  };

  return (
    <div>
      <CardHeader>
        <h3 className="text-lg">Удаление группы</h3>
      </CardHeader>
      <CardContent>
        <p>Вы уверены, что хотите удалить группу {code}?</p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
          Отмена
        </Button>
        <Button
          variant="destructive"
          className="ml-5"
          disabled={isLoading}
          onClick={onGroupDelete}
        >
          {isLoading ? <LoadingSpinner size={20} /> : "Удалить"}
        </Button>
      </CardFooter>
    </div>
  );
};

export default GroupDeleteModal;
