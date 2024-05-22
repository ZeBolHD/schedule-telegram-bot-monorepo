import deleteDocumentCategory from "@/actions/deleteDocumentCategory";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";

interface DocumentCategoryDeleteModalProps {
  id: number;
  name: string;
}

const DocumentCategoryDeleteModal = ({ id, name }: DocumentCategoryDeleteModalProps) => {
  const session = useSession();

  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (id: number) => deleteDocumentCategory(id, session.data?.accessToken!),
    onSuccess: () => {
      queryClient.refetchQueries(["categories"]);
    },
  });

  const onDelete = async () => {
    const status = await mutateAsync(id);

    if (!status) {
      toast.error("Что-то пошло не так");
      return;
    }

    if (status === 200) {
      toast.success(`Категория ${name} успешно удалёна`);
      document.getElementById("closeDialog")?.click();
      return;
    }

    toast.error("Что-то пошло не так");
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Удаление категории {name}</DialogTitle>
      </DialogHeader>

      <p className="mt-5">Вы уверены, что хотите категорию {name}?</p>

      <DialogFooter className="justify-end">
        <Button variant="destructive" className="ml-5" disabled={isLoading} onClick={onDelete}>
          {isLoading ? <LoadingSpinner size={20} /> : "Удалить"}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default DocumentCategoryDeleteModal;
