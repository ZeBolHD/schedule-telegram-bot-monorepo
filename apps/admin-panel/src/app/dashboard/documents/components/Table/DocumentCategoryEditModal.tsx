"use client";

import addDocumentsToCategory from "@/actions/addDocumentToCategory";
import getDocumentCategory from "@/actions/getDocumentCategory";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "react-query";
import DocumentListElement from "./DocumentListElement";
import deleteDocument from "@/actions/deleteDocument";

interface DocumentCategoryEditModalProps {
  id: number;
}

type DocumentCategoryEditFormInput = {
  documents: FileList;
};

const DocumentCategoryEditModal = ({ id }: DocumentCategoryEditModalProps) => {
  const { register, handleSubmit, reset } = useForm<DocumentCategoryEditFormInput>();

  const session = useSession();

  const {
    data: category,
    isLoading: isCategoryLoading,
    refetch: refetchCategory,
  } = useQuery(["category/" + id], () => getDocumentCategory(id, session.data?.accessToken!), {
    enabled: !!session.data?.accessToken,
  });

  const { mutateAsync: mutateAddDocuments, isLoading: isAddDocumentsLoading } = useMutation({
    mutationFn: (documents: FileList) =>
      addDocumentsToCategory(id, documents, session.data?.accessToken!),
  });

  const { mutateAsync: mutateDelete, isLoading: isDeleteLoading } = useMutation({
    mutationFn: (id: number) => deleteDocument(id, session.data?.accessToken!),
  });

  const handleDeleteDocument = async (id: number) => {
    const status = await mutateDelete(id);

    if (status === 200) {
      toast.success("Документ успешно удален");
      refetchCategory();
      return;
    }

    toast.error("Что-то пошло не так");
  };

  const onSubmit: SubmitHandler<DocumentCategoryEditFormInput> = async (data) => {
    const status = await mutateAddDocuments(data.documents);

    if (status === 201) {
      toast.success("Документы успешно добавлены");
      refetchCategory();
      reset();
      return;
    }

    toast.error("Что-то пошло не так");
  };

  if (isCategoryLoading) {
    return <LoadingSpinner size={100} />;
  }

  if (!category) {
    toast.error("Возникла ошибка при получении категории");
    document.getElementById("closeDialog")?.click();
    return null;
  }

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Редактирование категории документа</DialogTitle>
      </DialogHeader>

      <div>
        <h2 className="mt-5 text-lg">Название: {category.name}</h2>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-medium">Документы:</h3>
        <ul className="mt-2 flex flex-col gap-2">
          {category.documents.map((document) => {
            return (
              <DocumentListElement
                key={document.id}
                {...document}
                handleDeleteDocument={handleDeleteDocument}
              />
            );
          })}
        </ul>
      </div>

      <div className="w-full my-5 bg-black h-[2px]" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-5">
          <Label htmlFor="documents">Добавление новых документов</Label>
          <Input className="mt-2" type="file" multiple {...register("documents")} />
        </div>
        <DialogFooter className="mt-5">
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600"
            disabled={isAddDocumentsLoading || isDeleteLoading}
          >
            {isAddDocumentsLoading || isDeleteLoading ? <LoadingSpinner size={20} /> : "Добавить"}
          </Button>
        </DialogFooter>
      </form>

      <DialogClose id="closeDialog" />
    </div>
  );
};

export default DocumentCategoryEditModal;
