"use client";

import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { Group } from "@/types";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import LoadingSpinner from "@/components/LoadingSpinner";
import editGroup from "@/actions/editGroup";
import { useMutation, useQueryClient } from "react-query";
import { useSession } from "next-auth/react";

interface GroupEditModalProps {
  group: Group;
  onClose: () => void;
}

interface GroupEditFormInput {
  file: FileList | null | undefined;
  grade: number;
  notification: number;
}

const GroupEditModal = ({ group, onClose }: GroupEditModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, control, reset } = useForm<GroupEditFormInput>({
    defaultValues: {
      file: null,
      notification: 0,
      grade: group.grade,
    },
  });

  const session = useSession();

  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: (data: { file: File | null; notification: number; grade: number }) =>
      editGroup(
        group.id,
        data.notification,
        data.file as unknown as File,
        data.grade,
        session.data!.accessToken,
      ),
  });

  const onSubmit: SubmitHandler<GroupEditFormInput> = async (data) => {
    // if (!data.file && Number(data.grade) === group.grade) {
    //   return;
    // }

    if (!data.file) {
      return;
    }

    console.log(data);

    setIsLoading(true);

    const newGroup = await mutate.mutateAsync({ ...data, file: data.file[0] as File });

    if (!newGroup) {
      setIsLoading(false);
      reset();
      toast.error("Что-то пошло не так");
      return;
    }

    setIsLoading(false);
    toast.success("Группа успешно обновлена");
    queryClient.refetchQueries(["groups"]);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardHeader>
        <h3 className="text-xl">Изменить группу</h3>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <p className="text-md">Группа: {group.code}</p>
        </div>

        <div className="mt-5 w-full">
          <Label htmlFor="grade" className="text-md font-normal">
            Курс
          </Label>
          <Input
            type="number"
            id="grade"
            placeholder="Grade"
            defaultValue={group.grade}
            max={6}
            min={1}
            {...register("grade", { valueAsNumber: true })}
            className="mt-2"
          />
        </div>
        <div className="mt-5 w-full">
          <Label htmlFor="file" className="text-md font-normal">
            Файл
          </Label>
          <Input
            className="cursor-pointer mt-2"
            type="file"
            id="file"
            accept=".pdf"
            {...register("file")}
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">
            PDF (MAX. 20MB).
          </p>
        </div>
        <div className="mt-5 flex items-center">
          <Controller
            control={control}
            name="notification"
            defaultValue={0}
            render={({ field }) => (
              <>
                <Checkbox
                  id="notification"
                  {...field}
                  checked={field.value === 1}
                  value={1}
                  onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                />
                <Label htmlFor="notification" className="text-md font-normal ml-2.5 cursor-pointer">
                  Отправить уведомление
                </Label>
              </>
            )}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="button" variant="ghost" onClick={onClose} className="mr-5">
          Отмена
        </Button>
        <Button
          type="submit"
          variant={"default"}
          className="bg-blue-500 hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner size={20} /> : "Изменить"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default GroupEditModal;
