"use client";

import createDocumentCategory from "@/actions/createDocumentCategory";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";

type DocumentCreateInput = {
  name: string;
};

const DocumentCategoryCreate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DocumentCreateInput>();
  const session = useSession();

  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (name: string) => createDocumentCategory(name, session.data?.accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries("categories");
    },
  });

  const onSubmit: SubmitHandler<DocumentCreateInput> = async (data) => {
    const status = await mutateAsync(data.name);

    if (status === 201) {
      toast.success("Категория успешно создана");
      document.getElementById("closeDialog")?.click();
      return;
    }

    console.log(status);

    if (status === 409) {
      toast.error("Такая категория уже существует");
      return;
    }

    toast.error("Что-то пошло не так");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600">Создать категорию</Button>
      </DialogTrigger>
      <DialogContent className="text-black">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Создание категории</DialogTitle>
          </DialogHeader>

          <div className="mt-5">
            <Label htmlFor="name">Название</Label>
            <Input
              {...register("name", {
                required: {
                  message: "Это поле обязательно для заполнения",
                  value: true,
                },
              })}
              id="name"
              type="text"
              placeholder="Название категории"
              className="mt-2"
            />

            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>

          <DialogFooter className="mt-5">
            <DialogClose id="closeDialog" />
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
              Создать
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentCategoryCreate;
