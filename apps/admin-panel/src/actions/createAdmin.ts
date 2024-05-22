import { API_URL } from "@/lib/consts";
import axios, { AxiosError } from "axios";

const createAdmin = async (admin: { name: string; password: string }, accessToken: string) => {
  const url = API_URL + "users/create";

  try {
    const { status } = await axios.post(url, admin, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return status;
  } catch (e: AxiosError | any) {
    return e.response?.status;
  }
};

export default createAdmin;
