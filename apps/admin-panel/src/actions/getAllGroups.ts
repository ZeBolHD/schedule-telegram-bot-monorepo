import queryString from "query-string";
import axios from "axios";

import { GroupApiResponse, GroupFiltersType } from "@/types";
import { API_URL } from "@/lib/consts";

const getAllGroups = async (filters: GroupFiltersType, page: number, accessToken: string) => {
  if (!accessToken) {
    return null;
  }

  try {
    const url =
      API_URL + "groups" + "?" + queryString.stringify({ ...filters, page }, { skipNull: true });
    const { data } = await axios.get<GroupApiResponse>(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (e) {
    return null;
  }
};

export default getAllGroups;
