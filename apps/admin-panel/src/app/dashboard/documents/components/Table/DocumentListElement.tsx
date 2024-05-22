"use client";

import deleteDocument from "@/actions/deleteDocument";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { API_URL } from "@/lib/consts";
import { Document } from "@/types";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface DocumentListElementProps extends Document {
  handleDeleteDocument: (id: number) => void;
}

const DocumentListElement = ({
  id,
  name,
  fileId,
  handleDeleteDocument,
}: DocumentListElementProps) => {
  return (
    <li className="flex justify-between items-center border-black border-2 rounded-lg p-2" key={id}>
      <p className="w-[200px] truncate">{name}</p>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Открыть меню</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link href={API_URL + `files/${fileId}`}>
              <DropdownMenuItem>Скачать</DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={() => handleDeleteDocument(id)}>Удалить</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  );
};

export default DocumentListElement;
