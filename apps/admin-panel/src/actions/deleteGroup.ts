import { API_URL } from "@/lib/consts";
import axios, { AxiosError } from "axios";

const deleteGroup = async (groupId: number, accessToken: string) => {
  if (!accessToken) {
    return null;
  }

  const url = API_URL + "groups/" + groupId;

  try {
    const { status } = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return status;
  } catch (e: AxiosError | any) {
    return e.response?.status;
  }
};

export default deleteGroup;
