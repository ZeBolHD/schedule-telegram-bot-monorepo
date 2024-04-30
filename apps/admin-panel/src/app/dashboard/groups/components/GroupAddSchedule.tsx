"use client";

import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FullGroupType } from "@/types";

import useModal from "@/hooks/useModal";
import Modal from "@/components/Modal";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import addScheduleToGroups from "@/actions/addScheduleToGroups";
import { TableGroupsDataContext } from "@/context/TableGroupsDataContext";

interface GroupAddScheduleProps {
  disabled?: boolean;
  groups: FullGroupType[];
  resetRowSelection: () => void;
}

interface GroupAddScheduleForm {
  file: FileList;
  notification: number;
}

const GroupAddSchedule = ({
  groups,
  disabled,
  resetRowSelection,
}: GroupAddScheduleProps) => {
  const { isModalOpen, toggleModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const { refetch } = useContext(TableGroupsDataContext);

  const { register, handleSubmit, reset, control } =
    useForm<GroupAddScheduleForm>();

  const onSuccess = () => {
    resetRowSelection();
    refetch();
    reset();
    toggleModal();
    toast.success("Schedule added successfully");
    setIsLoading(false);
  };

  const onSubmit: SubmitHandler<GroupAddScheduleForm> = async (data) => {
    setIsLoading(true);

    const file = data.file?.[0];
    const notification = data.notification;
    const groupIds = groups.map((group) => group.id);

    if (!file) {
      return;
    }

    const status = await addScheduleToGroups(groupIds, file, notification);

    if (!status) {
      toast.error("Something went wrong");
      setIsLoading(false);

      return;
    }

    onSuccess();
  };

  const groupsCodesString = groups.map((group) => group.code).join(", ");

  return (
    <>
      <Button
        type="button"
        className="mr-5 bg-blue-500 hover:bg-blue-600"
        onClick={toggleModal}
        disabled={disabled}
      >
        Добавить расписание группам
      </Button>

      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <h3 className="text-lg">Добавление расписания</h3>
          </CardHeader>
          <CardContent>
            <div>
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
              <p
                className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                id="file_input_help"
              >
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
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? 1 : 0)
                      }
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
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              className="mr-5"
              onClick={toggleModal}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 hover:to-blue-600"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner size={20} /> : "Добавить"}
            </Button>
          </CardFooter>
        </form>
      </Modal>
    </>
  );
};

export default GroupAddSchedule;
