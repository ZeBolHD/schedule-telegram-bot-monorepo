"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import useModal from "@/hooks/useModal";

interface ProfileProps {}

const Profile = ({}: ProfileProps) => {
  const { isModalOpen, toggleModal } = useModal();

  const session = useSession();
  const user = session.data?.user;
  const firstLetter = user?.name?.charAt(0).toUpperCase();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <>
      <div className="flex items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center">
            {firstLetter}
          </div>
          <p className="ml-4">{user?.name}</p>
        </div>
        <Button
          variant={"destructive"}
          type="button"
          onClick={toggleModal}
          className="ml-10"
        >
          Выйти
        </Button>
      </div>
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <CardHeader>
          <h3 className="text-lg">Выход</h3>
        </CardHeader>
        <CardContent>
          <p className="text-md">Вы действительно хотите выйти?</p>
        </CardContent>
        <CardFooter>
          <div className="w-full flex justify-end">
            <Button
              type="button"
              variant={"outline"}
              onClick={toggleModal}
              className="mr-5"
            >
              Отмена
            </Button>
            <Button
              type="button"
              variant={"destructive"}
              onClick={handleSignOut}
            >
              Выйти
            </Button>
          </div>
        </CardFooter>
      </Modal>
    </>
  );
};

export default Profile;
