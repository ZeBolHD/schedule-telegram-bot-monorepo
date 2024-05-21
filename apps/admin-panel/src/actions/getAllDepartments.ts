import { API_URL } from "@/lib/consts";
import { Department } from "@/types";
import axios from "axios";

const getAllDepartments = async (accessToken: string) => {
  if (!accessToken) {
    return null;
  }

  const url = API_URL + "departments";

  try {
    const { data } = await axios.get<Department[]>(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (e) {
    return null;
  }
};

export default getAllDepartments;
