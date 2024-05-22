import { API_URL } from "@/lib/consts";
import axios, { AxiosError } from "axios";

const deleteAdmin = async (id: number, accessToken: string) => {
  const url = API_URL + "users/" + id;

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

export default deleteAdmin;
