import createAdmin from "@/actions/createAdmin";
import LoadingSpinner from "@/components/LoadingSpinner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@/types";
import { useSession } from "next-auth/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";

type AdminInput = {
  name: string;
  password: string;
  role: Role;
};

const AdminCreate = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AdminInput>({
    defaultValues: {
      name: "",
      password: "",
      role: Role.ADMIN,
    },
  });

  const session = useSession();

  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (data: AdminInput) => createAdmin(data, session.data?.accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries("adminUsers");
    },
  });

  const onSubmit: SubmitHandler<AdminInput> = async (data) => {
    const status = await mutateAsync(data);

    if (status === 201) {
      toast.success("Администратор успешно создан");
      reset();
      document.getElementById("closeDialog")?.click();
      return;
    }

    if (status === 409) {
      toast.error("Такой администратор уже существует");
      return;
    }

    toast.error("Что-то пошло не так");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600">Создать администратора</Button>
      </DialogTrigger>
      <DialogContent className="text-black">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Создание администратора</DialogTitle>
          </DialogHeader>

          <div className="mt-5">
            <Label htmlFor="name">Имя</Label>
            <Input
              {...register("name", { required: { message: "Обязательное поле", value: true } })}
              className="w-full mt-2"
              type="text"
              placeholder="Имя администратора"
            />
            {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>}
          </div>

          <div className="mt-5">
            <Label htmlFor="password">Пароль</Label>
            <Input
              {...register("password", { required: { message: "Обязательное поле", value: true } })}
              minLength={8}
              className="w-full mt-2"
              type="text"
              placeholder="Пароль"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-2">{errors.password.message}</p>
            )}
          </div>

          <div className="mt-5">
            <Label htmlFor="role">Роль</Label>
            <Controller
              name="role"
              control={control}
              rules={{ required: { message: "Обязательное поле", value: true } }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Роль" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(Role).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.role && <p className="text-red-500 text-sm mt-2">{errors.role.message}</p>}
          </div>
          <DialogFooter className="mt-5">
            <Button className="bg-blue-500 hover:bg-blue-600" type="submit">
              {isLoading ? <LoadingSpinner size={20} /> : "Создать"}
            </Button>
            <DialogClose id="closeDialog" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCreate;
