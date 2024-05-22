"use client";

import createTeacher from "@/actions/createTeacher";
import getAllDepartments from "@/actions/getAllDepartments";
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
import { Teacher } from "@/types";
import { useSession } from "next-auth/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";

type TeacherCreateType = Omit<Teacher, "id" | "createdAt" | "departmentName">;

const TeacherCreate = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TeacherCreateType>();

  const session = useSession();

  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (data: TeacherCreateType) => createTeacher(data, session.data?.accessToken!),
    onSuccess: () => {
      queryClient.refetchQueries(["teachers"]);
    },
  });

  const { data: departments } = useQuery(
    "departments",
    () => getAllDepartments(session.data?.accessToken!),
    {
      enabled: !!session.data?.accessToken,
    },
  );

  const onSubmit: SubmitHandler<TeacherCreateType> = async (data: TeacherCreateType) => {
    const status = await mutateAsync(data);

    if (!status) {
      toast.error("Что-то пошло не так");
      return;
    }

    if (status === 409) {
      toast.error("Такой преподаватель уже существует");
      return;
    }

    if (status === 201) {
      toast.success("Преподаватель успешно создан");
      reset();
      document.getElementById("closeDialog")?.click();
      return;
    }

    toast.error("Что-то пошло не так");
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-blue-500 hover:bg-blue-600">Добавить преподавателя</Button>
        </DialogTrigger>
        <DialogContent className="text-black">
          <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Добавление преподавателя</DialogTitle>
            </DialogHeader>
            <div className="mt-5">
              <Label id="name">ФИО</Label>
              <Input
                className="mt-2"
                {...register("name", {
                  required: { message: "Поле является обязательным", value: true },
                })}
                id="name"
                placeholder="Иванов Иван Иванович"
              />
              {errors.name && <p className="mt-2 text-red-500">{errors.name.message}</p>}
            </div>
            <div className="mt-5">
              <Label id="departmentId">Кафедра</Label>
              <Controller
                control={control}
                name="departmentId"
                rules={{ required: { message: "Поле является обязательным", value: true } }}
                render={({ field }) => (
                  <Select onValueChange={(value) => field.onChange(Number(value))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Кафедра" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments?.map((department) => (
                        <SelectItem key={department.id} value={String(department.id)}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.departmentId && (
                <p className="mt-2 text-red-500">{errors.departmentId.message}</p>
              )}
            </div>
            <div className="mt-5">
              <Label id="place">Должность</Label>
              <Input
                className="mt-2"
                {...register("place", {
                  required: {
                    message: "Поле является обязательным",
                    value: true,
                  },
                })}
                id="place"
                placeholder="Должность"
              />
              {errors.place && <p className="mt-2 text-red-500">{errors.place.message}</p>}
            </div>

            <div className="mt-5">
              <Label id="contact">Контакт</Label>
              <Input
                {...register("contact", {
                  required: false,
                  setValueAs: (value) => (value === "" ? null : value),
                  validate: (value) =>
                    !value ? true : value!.length > 2 || "Минимальная длина поля 3 символа",
                })}
                defaultValue={""}
                id="contact"
                placeholder="Контакт"
              />
              {errors.contact && <p className="mt-2 text-red-500">{errors.contact.message}</p>}
            </div>
            <DialogFooter className="mt-5">
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                {isLoading ? <LoadingSpinner size={20} /> : "Создать"}
              </Button>
              <DialogClose id="closeDialog" />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeacherCreate;
