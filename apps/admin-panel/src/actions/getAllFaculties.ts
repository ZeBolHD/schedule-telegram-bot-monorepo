import { API_URL } from "@/lib/consts";
import { Faculty } from "@repo/database";
import axios from "axios";

const getAllFaculties = async (accessToken: string) => {
  try {
    const { data } = await axios.get<Faculty[]>(API_URL + "faculties", {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (e) {
    return null;
  }
};

export default getAllFaculties;
