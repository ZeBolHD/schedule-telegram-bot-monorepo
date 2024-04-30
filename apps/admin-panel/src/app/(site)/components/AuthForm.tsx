"use client";

import { SignInResponse, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFormInput {
  username: string;
  password: string;
}

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();

  const { register, handleSubmit } = useForm<AuthFormInput>();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/dashboard");
    }
  }, [session.status, router]);

  const checkCredentials = (callback: SignInResponse) => {
    if (!callback.error && callback.ok) {
      toast.success("Вы успешно вошли");
      router.push("/dashboard");
    }

    if (callback.error) {
      toast.error("Неверные данные");
    }
  };

  const onSubmit: SubmitHandler<AuthFormInput> = (data) => {
    const username = data.username;
    const password = data.password;

    signIn("credentials", {
      username,
      password,
      redirect: false,
    })
      .then((callback) => {
        checkCredentials(callback!);
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  return (
    <Card className="w-96 bg-white rounded-md flex flex-col text-black">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <h3 className="text-xl">Добро пожаловать в админ панель</h3>
        </CardHeader>
        <CardContent>
          <div className="">
            <Label htmlFor="username">Имя пользователя</Label>
            <Input
              type="text"
              className="mt-3"
              {...register("username", { required: true })}
            />
          </div>
          <div className="mt-5">
            <Label htmlFor="password">Пароль</Label>
            <Input
              type="password"
              className="mt-3"
              {...register("password", { required: true })}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" variant={"default"} className="w-full">
            Войти
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForm;
