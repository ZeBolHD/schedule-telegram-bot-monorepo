import { API_URL } from "@/lib/consts";
import { Admin } from "@/types";
import axios from "axios";

const getAllAdmins = async (accessToken: string) => {
  if (!accessToken) {
    return null;
  }

  const url = API_URL + "users";

  try {
    const { data } = await axios.get<Admin[]>(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return data;
  } catch (e) {
    return null;
  }
};

export default getAllAdmins;
