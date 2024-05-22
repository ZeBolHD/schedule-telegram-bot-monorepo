import { API_URL } from "@/lib/consts";
import axios, { AxiosError } from "axios";

const deleteDocumentCategory = async (id: number, accessToken: string) => {
  if (!accessToken) {
    return null;
  }

  const url = API_URL + "documents/categories/" + id;

  try {
    const { status } = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return status;
  } catch (e: AxiosError | any) {
    console.log(e);
    return e.response?.status;
  }
};

export default deleteDocumentCategory;
