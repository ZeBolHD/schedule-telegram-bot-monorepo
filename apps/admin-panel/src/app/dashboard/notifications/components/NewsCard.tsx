import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";

import { sendNews } from "@/actions/sendNews";

import { News } from "@/types";

const NewsCard = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<News>({ mode: "onBlur", defaultValues: {} });

  const onSubmit: SubmitHandler<News> = async (data) => {
    setIsLoading(true);

    const res = await sendNews(data);

    setIsLoading(false);

    if (res) {
      toast.success("Новость успешно отправлена");
      reset();
      return;
    }

    toast.error("Что-то пошло не так");
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl">Новость</h3>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="heading" className="mb-1">
              Заголовок
            </Label>
            <Input
              {...register("heading", { required: "Это поле обязательно" })}
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
            <Label>Изображения</Label>
            <Input
              {...register("images")}
              type="file"
              className="w-full mt-2"
              multiple
              accept="image/*"
            />
          </div>

          <div className="mt-5">
            <Label htmlFor="content" className="mb-1">
              Текст
            </Label>
            <Textarea
              {...register("content", { required: "Это поле обязательно" })}
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

export default NewsCard;
