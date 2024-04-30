"use client";

import { useContext } from "react";
import { Faculty } from "@prisma/client";
import { toast } from "react-hot-toast";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import Modal from "@/components/Modal";

import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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
import { TableGroupsDataContext } from "@/context/TableGroupsDataContext";
import useModal from "@/hooks/useModal";

interface GroupCreateProps {
  faculties: Faculty[];
}

const GroupCreate = ({ faculties }: GroupCreateProps) => {
  const { refetch } = useContext(TableGroupsDataContext);

  const { isModalOpen, toggleModal } = useModal();

  const { register, handleSubmit, control, reset } = useForm<GroupCreateType>();

  const onCloseModal = () => {
    toggleModal();
    reset();
  };

  const onSubmit: SubmitHandler<GroupCreateType> = async (data) => {
    const status = await createGroup(data);
    if (status === 200) {
      toggleModal();
      reset();
      refetch();
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
    <>
      <Button
        type="button"
        className="px-5 py-5 bg-blue-500 text-white hover:bg-blue-600"
        onClick={toggleModal}
      >
        Создать группу
      </Button>
      <Modal isOpen={isModalOpen} onClose={onCloseModal}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <h3 className="text-lg">Создание группы</h3>
          </CardHeader>
          <CardContent className="text-lg">
            <div>
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
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      required
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue
                          placeholder="Выберите факультет"
                          id="facultyId"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {faculties?.map((faculty) => (
                          <SelectItem
                            key={faculty.id}
                            value={faculty.id.toString()}
                          >
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
                      onValueChange={field.onChange}
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
                {...register("grade", { required: true })}
                type="number"
                placeholder="4"
                max={6}
                min={1}
                className="mt-2"
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={onCloseModal}
                className="mr-5"
              >
                Отмена
              </Button>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                Создать
              </Button>
            </div>
          </CardFooter>
        </form>
      </Modal>
    </>
  );
};

export default GroupCreate;
