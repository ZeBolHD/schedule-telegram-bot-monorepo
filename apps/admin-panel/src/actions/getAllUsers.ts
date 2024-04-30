import axios from "axios";

import { FullTelegramUserType } from "@/types";

const getAllUsers = async () => {
  try {
    const { data } = await axios.get<FullTelegramUserType[]>("/api/users");
    return data;
  } catch (e) {
    return null;
  }
};

export default getAllUsers;
