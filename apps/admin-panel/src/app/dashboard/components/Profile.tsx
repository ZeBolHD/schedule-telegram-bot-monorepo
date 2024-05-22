"use client";

import { signOut, useSession } from "next-auth/react";

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

const Profile = () => {
  const session = useSession();
  const user = session.data?.user;
  const firstLetter = user?.name?.charAt(0).toUpperCase();

  const handleSignOut = () => {
    signOut();
    document.getElementById("closeDialog")?.click();
  };

  const handleCancel = () => {
    document.getElementById("closeDialog")?.click();
  };

  return (
    <Dialog>
      <div className="flex items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center">
            {firstLetter}
          </div>
          <p className="ml-4">{user?.name}</p>
        </div>
        <DialogTrigger asChild>
          <Button variant="destructive" type="button" className="ml-10">
            Выйти
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="text-black">
        <DialogHeader>
          <DialogTitle>Выход</DialogTitle>
        </DialogHeader>
        <p className="text-md">Вы действительно хотите выйти?</p>
        <DialogFooter>
          <div className="w-full flex justify-end">
            <Button type="button" onClick={handleCancel} variant="outline" className="mr-5">
              Отмена
            </Button>
            <Button type="button" variant="destructive" onClick={handleSignOut}>
              Выйти
            </Button>
            <DialogClose id="closeDialog" />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Profile;
