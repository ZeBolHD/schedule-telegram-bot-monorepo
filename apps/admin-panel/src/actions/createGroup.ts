import axios from "axios";

import { GroupCreateType, FullGroupType } from "@/types";

const createGroup = async (data: GroupCreateType) => {
  try {
    const { status } = await axios.post<FullGroupType>("/api/groups/add", data);
    return status;
  } catch (e) {
    const status = (axios.isAxiosError(e) && e.response?.status) || 0;
    return status;
  }
};

export default createGroup;
