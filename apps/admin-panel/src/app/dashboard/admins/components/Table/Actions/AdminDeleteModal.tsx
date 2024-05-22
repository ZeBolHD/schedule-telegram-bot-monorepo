import deleteAdmin from "@/actions/deleteAdmin";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";

interface AdminDeleteModalProps {
  id: number;
  name: string;
}

const AdminDeleteModal = ({ id, name }: AdminDeleteModalProps) => {
  const session = useSession();

  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (id: number) => deleteAdmin(id, session.data?.accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminUsers"]);
    },
  });

  const onDelete = async () => {
    const status = await mutateAsync(id);

    if (status === 200) {
      toast.success(`Администратор ${name} успешно удалён`);
      document.getElementById("closeDialog")?.click();
      return;
    }

    toast.error("Что-то пошло не так, попробуйте ещё раз");
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Удаление администратора {name}</DialogTitle>
      </DialogHeader>

      <p className="mt-5">Вы уверены, что хотите удалить администратора {name}?</p>

      <DialogFooter className="mt-5">
        <Button variant="destructive" onClick={onDelete}>
          {isLoading ? <LoadingSpinner size={20} /> : "Удалить"}
        </Button>
        <DialogClose id="closeDialog" />
      </DialogFooter>
    </div>
  );
};

export default AdminDeleteModal;
