import { API_URL } from "@/lib/consts";
import { Teacher } from "@/types";
import axios from "axios";

const createTeacher = async (
  teacher: Omit<Teacher, "id" | "createdAt" | "departmentName">,
  accessToken: string,
) => {
  if (!accessToken) {
    return null;
  }

  const url = API_URL + "teachers";

  try {
    const { status } = await axios.post<Teacher>(url, teacher, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return status;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default createTeacher;
