import { API_URL } from "@/lib/consts";
import { DocumentCategoryWithDocuments } from "@/types";
import axios, { AxiosError } from "axios";

const getDocumentCategory = async (id: number, accessToken: string) => {
  if (!accessToken) {
    return null;
  }

  const url = API_URL + "documents/categories/" + id;

  try {
    const { data } = await axios.get<DocumentCategoryWithDocuments>(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (e: AxiosError | any) {
    console.log(e);
    return e.response?.status;
  }
};

export default getDocumentCategory;
