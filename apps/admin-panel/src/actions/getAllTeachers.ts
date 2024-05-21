import { API_URL } from "@/lib/consts";
import { GetAllTeachersQuery, GetAllTeachersResponse } from "@/types";
import axios from "axios";
import queryString from "query-string";

export const getAllTeachers = async (query: GetAllTeachersQuery, accessToken: string) => {
  if (!accessToken) {
    return null;
  }

  try {
    const url = API_URL + "teachers" + "?" + queryString.stringify(query, { skipNull: true });
    const { data } = await axios.get<GetAllTeachersResponse>(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (error) {
    return null;
  }
};
