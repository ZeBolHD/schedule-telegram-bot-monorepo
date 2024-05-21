import queryString from "query-string";
import axios from "axios";

import { GetAllGroupsQuery, GroupApiResponse, GroupFiltersType } from "@/types";
import { API_URL } from "@/lib/consts";

const getAllGroups = async (query: GetAllGroupsQuery, accessToken: string) => {
  if (!accessToken) {
    return null;
  }

  try {
    const url = API_URL + "groups" + "?" + queryString.stringify(query, { skipNull: true });
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
