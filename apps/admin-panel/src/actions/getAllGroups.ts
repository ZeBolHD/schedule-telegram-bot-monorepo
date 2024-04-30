import axios from "axios";

import { FullGroupType } from "@/types";

const getAllGroups = async () => {
  try {
    const url = "/api/groups";
    const { data } = await axios.get<FullGroupType[]>(url);
    return data;
  } catch (e) {
    return null;
  }
};

export default getAllGroups;
