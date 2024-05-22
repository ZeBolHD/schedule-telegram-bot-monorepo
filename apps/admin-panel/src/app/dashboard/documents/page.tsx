"use client";

import getAllDocumentCategories from "@/actions/getAllDocumentCategories";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import DocumentCategoriesTable from "./components/Table";
import DocumentCategoryCreate from "./components/DocumentCategoryCreate";

const DocumentsPage = () => {
  const session = useSession();
  const { data, isLoading } = useQuery(
    ["categories"],
    () => getAllDocumentCategories(session.data?.accessToken!),
    {
      enabled: !!session.data?.accessToken,
      initialData: [],
    },
  );

  if (isLoading || !session.data?.accessToken) {
    return <LoadingSpinner size={100} />;
  }

  return (
    <div className="p-10">
      <div className="mb-10 flex justify-end">
        <DocumentCategoryCreate />
      </div>
      <DocumentCategoriesTable categories={data!} />
    </div>
  );
};

export default DocumentsPage;
