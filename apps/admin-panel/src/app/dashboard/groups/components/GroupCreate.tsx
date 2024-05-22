"use client";

import { toast } from "react-hot-toast";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { GroupCreateType } from "@/types";
import createGroup from "@/actions/createGroup";

import getAllFaculties from "@/actions/getAllFaculties";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const GroupCreate = () => {
  const queryClient = useQueryClient();

  const session = useSession();

  const { data: faculties } = useQuery(
    "faculties",
    () => getAllFaculties(session.data?.accessToken!),
    {
      enabled: !!session.data?.accessToken,
    },
  );

  const { register, handleSubmit, control, reset } = useForm<GroupCreateType>();

  const mutation = useMutation({
    mutationFn: (data: GroupCreateType) => createGroup(data, session.data?.accessToken!),
    onSuccess: () => {
      queryClient.refetchQueries(["groups"]);
    },
  });

  const onSubmit: SubmitHandler<GroupCreateType> = async (data) => {
    const status = await mutation.mutateAsync(data);
    if (status === 201) {
      document.getElementById("closeDialog")?.click();
      reset();
      toast.success("Группа успешно создана");
      return;
    }

    if (status === 409) {
      toast.error("Группа с таким номером уже существует");
    } else {
      toast.error("Что-то пошло не так");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" className="px-5 py-5 bg-blue-500 text-white hover:bg-blue-600">
          Создать группу
        </Button>
      </DialogTrigger>
      <DialogContent className="text-black">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Создание группы</DialogTitle>
          </DialogHeader>
          <div className="mt-5">
            <Label htmlFor="code" className="text-base font-normal">
              Номер группы
            </Label>
            <Input
              {...register("code", { required: true })}
              type="text"
              placeholder="Например 3001"
              className="mt-2"
            />
          </div>
          <div className="mt-5">
            <Label htmlFor="code" className="text-base font-normal">
              Факультет
            </Label>
            <Controller
              control={control}
              name="facultyId"
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => {
                return (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value}
                    required
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Выберите факультет" id="facultyId" />
                    </SelectTrigger>
                    <SelectContent>
                      {faculties?.map((faculty) => (
                        <SelectItem key={faculty.id} value={faculty.id.toString()}>
                          {faculty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }}
            />
          </div>
          <div className="mt-5">
            <Label htmlFor="studyType" className="text-base font-normal">
              Форма обучения
            </Label>
            <Controller
              control={control}
              name="studyType"
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => {
                return (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value}
                    required
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Выберите форму обучения" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="0">Очная</SelectItem>
                      <SelectItem value="1">Заочная</SelectItem>
                    </SelectContent>
                  </Select>
                );
              }}
            />
          </div>
          <div className="mt-5">
            <Label htmlFor="grade" className="text-base font-normal">
              Курс
            </Label>
            <Input
              {...register("grade", { required: true, valueAsNumber: true })}
              type="number"
              placeholder="4"
              max={6}
              min={1}
              className="mt-2"
            />
          </div>
          <DialogFooter className="mt-5">
            <div className="w-full flex justify-end">
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                Создать
              </Button>
            </div>
            <DialogClose id="closeDialog" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GroupCreate;
