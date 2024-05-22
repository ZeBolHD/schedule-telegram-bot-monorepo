"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Group } from "@/types";

import LoadingSpinner from "@/components/LoadingSpinner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import addScheduleToGroups from "@/actions/addScheduleToGroups";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GroupAddScheduleProps {
  disabled?: boolean;
  groups: Group[];
  resetRowSelection: () => void;
}

interface GroupAddScheduleForm {
  file: FileList;
  notification: number;
}

const GroupAddSchedule = ({ groups, disabled, resetRowSelection }: GroupAddScheduleProps) => {
  const session = useSession();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: GroupAddScheduleForm) =>
      addScheduleToGroups(
        groups.map((group) => group.id),
        data.file[0],
        data.notification,
        session.data!.accessToken,
      ),
  });

  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, control } = useForm<GroupAddScheduleForm>();

  const onSuccess = () => {
    resetRowSelection();
    queryClient.refetchQueries(["groups"]);
    reset();
    document.getElementById("closeDialog")?.click();
    toast.success("Schedule added successfully");
    setIsLoading(false);
  };

  const onSubmit: SubmitHandler<GroupAddScheduleForm> = async (data) => {
    setIsLoading(true);

    if (!data.file[0]) {
      return;
    }

    const status = await mutation.mutateAsync(data);

    console.log(status);

    if (!status) {
      toast.error("Something went wrong");
      setIsLoading(false);

      return;
    }

    onSuccess();
  };

  const groupsCodesString = groups.map((group) => group.code).join(", ");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" className="mr-5 bg-blue-500 hover:bg-blue-600" disabled={disabled}>
          Добавить расписание группам
        </Button>
      </DialogTrigger>

      <DialogContent className="text-black">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Добавление расписание группам</DialogTitle>
          </DialogHeader>

          <div className="mt-5">
            <Label htmlFor="group_codes" className="text-md font-normal">
              Группы:
            </Label>
            <p id="group_codes" className="text-md">
              {groupsCodesString}
            </p>
          </div>
          <div className="mt-5 w-full">
            <Label htmlFor="file" className="text-lg font-normal">
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
                  <Label
                    htmlFor="notification"
                    className="text-md font-normal ml-2.5 cursor-pointer"
                  >
                    Отправить уведомление
                  </Label>
                </>
              )}
            />
          </div>

          <DialogFooter className="mt-5 flex justify-end">
            <Button type="submit" className="bg-blue-500 hover:to-blue-600" disabled={isLoading}>
              {isLoading ? <LoadingSpinner size={20} /> : "Добавить"}
            </Button>
            <DialogClose id="closeDialog" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GroupAddSchedule;
