import { API_URL } from "@/lib/consts";
import { Teacher } from "@/types";
import axios from "axios";

const editTeacher = async (
  teacher: Omit<Teacher, "createdAt" | "departmentName">,
  accessToken: string,
) => {
  if (!accessToken) {
    return null;
  }

  const url = API_URL + "teachers/" + teacher.id;

  try {
    const { data } = await axios.patch<Teacher>(url, teacher, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default editTeacher;
