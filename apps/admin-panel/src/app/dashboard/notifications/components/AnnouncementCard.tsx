import { useState } from "react";
import { toast } from "react-hot-toast";
import { SubmitHandler, useForm } from "react-hook-form";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";

import sendAnnouncement from "@/actions/sendAnnouncement";

import { Announcement } from "@/types";

const AnnouncementCard = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<Announcement>({ mode: "onBlur", defaultValues: {} });

  const onSubmit: SubmitHandler<Announcement> = async (data) => {
    setIsLoading(true);

    const res = await sendAnnouncement(data);

    setIsLoading(false);

    if (res) {
      toast.success("Объявление успешно отправлено");
      reset();
      return;
    }

    toast.error("Что-то пошло не так");
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl">Объявление</h3>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="heading" className="mb-1">
              Заголовок
            </Label>
            <Input
              id="heading"
              {...register("heading", {
                required: "Это поле обязательно для заполнения",
              })}
              className="w-full mt-2"
              placeholder="Заголовок"
            />
            {errors.heading && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.heading.message}
              </p>
            )}
          </div>
          <div className="mt-5">
            <Label htmlFor="content" className="mb-1">
              Текст
            </Label>
            <Textarea
              id="content"
              {...register("content", {
                required: "Это поле обязательно для заполнения",
              })}
              className="w-full mt-2"
              placeholder="Текст"
            />
            {errors.content && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.content.message}
              </p>
            )}
            <p className="text-sm text-zinc-500 mt-2">
              Поддерживается текстовая разметка по{" "}
              <a
                href="https://core.telegram.org/bots/api#markdownv2-style"
                target="_blank"
                className="underline"
              >
                ссылке
              </a>
              .
            </p>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full mt-5">
            {isLoading ? <LoadingSpinner size={20} /> : "Отправить"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AnnouncementCard;
