"use client";

import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { Group, Teacher } from "@/types";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/LoadingSpinner";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import editTeacher from "@/actions/editTeacher";
import getAllDepartments from "@/actions/getAllDepartments";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeacherEditModalProps {
  teacher: Teacher;
}

interface TeacherEditFormInput {
  name: string;
  departmentId: number;
  place: string;
  contact: string;
}

const TeacherEditModal = ({ teacher }: TeacherEditModalProps) => {
  const { register, handleSubmit, control, reset } = useForm<TeacherEditFormInput>({
    defaultValues: {
      name: teacher.name,
      departmentId: teacher.departmentId,
      place: teacher.place,
      contact: teacher.contact,
    },
  });

  const session = useSession();

  const { data: departments } = useQuery(
    "departments",
    () => getAllDepartments(session.data?.accessToken!),
    {
      enabled: !!session.data?.accessToken,
    },
  );

  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (data: TeacherEditFormInput) =>
      editTeacher(
        {
          id: teacher.id,
          ...data,
        },
        session.data?.accessToken!,
      ),
  });

  const onSubmit: SubmitHandler<TeacherEditFormInput> = async (data) => {
    console.log(data);

    const newTeacher = await mutateAsync({ ...data });

    if (!newTeacher) {
      reset();
      toast.error("Что-то пошло не так");
      return;
    }

    document.getElementById("closeDialog")?.click();
    toast.success("Преподаватель успешно обновлён");
    queryClient.refetchQueries(["teachers"]);
    document.getElementById("closeDialog")?.click();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogHeader>
        <DialogTitle>Изменить данные преподавателя</DialogTitle>
      </DialogHeader>

      <div className="mt-5">
        <div className="w-full">
          <p className="text-md">ФИО: {teacher.name}</p>
        </div>
      </div>

      <div className="mt-5">
        <Label htmlFor="departmentId">Кафедра:</Label>
        <Controller
          name="departmentId"
          control={control}
          render={({ field }) => (
            <Select
              value={String(field.value)}
              defaultValue={String(teacher.departmentId)}
              onValueChange={(value) => field.onChange(Number(value))}
            >
              <SelectTrigger id="departmentId" value={field.value} className="mt-2 w-full">
                <SelectValue placeholder="Кафедра" />
              </SelectTrigger>
              <SelectContent>
                {departments?.map((department) => (
                  <SelectItem
                    key={department.id}
                    value={String(department.id)}
                    className="cursor-pointer"
                    onSelect={field.onChange}
                  >
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="mt-5 w-full">
        <Label htmlFor="place">Должность</Label>
        <Input
          type="text"
          id="place"
          placeholder="Должность"
          defaultValue={teacher.place}
          {...register("place")}
          className="mt-2"
        />
      </div>

      <div className="mt-5 w-full">
        <Label htmlFor="contact">Контакт</Label>
        <Input
          type="text"
          id="contact"
          placeholder="Контакт"
          defaultValue={teacher.contact}
          {...register("contact")}
          className="mt-2"
        />
      </div>

      <DialogFooter className="mt-5 flex justify-end">
        <Button
          type="submit"
          variant={"default"}
          className="bg-blue-500 hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner size={20} /> : "Изменить"}
        </Button>
        <DialogClose id="closeDialog" />
      </DialogFooter>
    </form>
  );
};

export default TeacherEditModal;
