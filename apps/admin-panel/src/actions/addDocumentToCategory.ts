import { API_URL } from "@/lib/consts";
import axios, { AxiosError } from "axios";

const addDocumentsToCategory = async (
  categoryId: number,
  documents: FileList,
  accessToken: string,
) => {
  if (!accessToken) {
    return null;
  }

  const url = API_URL + "documents/categories/" + categoryId;
  const formData = new FormData();

  for (let document of documents) {
    formData.append("documents", document);
  }

  try {
    const { status } = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return status;
  } catch (e: AxiosError | any) {
    console.log(e);
    return e.response?.status;
  }
};

export default addDocumentsToCategory;
