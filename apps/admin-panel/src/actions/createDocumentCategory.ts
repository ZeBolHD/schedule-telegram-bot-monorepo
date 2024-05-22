import { API_URL } from "@/lib/consts";
import axios, { AxiosError } from "axios";

const createDocumentCategory = async (name: string, accessToken: string) => {
  if (!accessToken) {
    return null;
  }

  const url = API_URL + "documents/categories";

  try {
    const { status } = await axios.post(
      url,
      { name },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return status;
  } catch (e: AxiosError | any) {
    console.log(e);
    return e.response?.status;
  }
};

export default createDocumentCategory;
