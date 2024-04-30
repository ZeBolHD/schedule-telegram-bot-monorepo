"use client";

import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  const portal = document.getElementById("modal");

  const onClickModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="absolute w-full h-full inset-0 flex items-center justify-center 
    bg-black bg-opacity-30 backdrop-blur-sm z-10"
      onClick={onClickModal}
    >
      <Card className="absolute  w-[500px] text-black z-50">{children}</Card>
    </div>,
    portal!
  );
};

export default Modal;
