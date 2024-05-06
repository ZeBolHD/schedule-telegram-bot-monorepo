import axios from "axios";

import { GroupCreateType, Group } from "@/types";
import { API_URL } from "@/lib/consts";

const createGroup = async (data: GroupCreateType, accessToken: string) => {
  try {
    const { status } = await axios.post<Group>(API_URL + "groups", data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return status;
  } catch (e) {
    const status = (axios.isAxiosError(e) && e.response?.status) || 0;
    return status;
  }
};

export default createGroup;
