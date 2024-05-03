import axios from "axios";

import { FullTelegramUserType } from "@/types";
import { API_URL } from "@/lib/consts";

const getAllUsers = async (accessToken: string) => {
  try {
    const { data } = await axios.get<FullTelegramUserType[]>(API_URL + "users/telegram", {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (e) {
    return null;
  }
};

export default getAllUsers;
