import { API_URL } from "@/lib/consts";
import { Teacher } from "@/types";
import axios, { AxiosError } from "axios";

const editTeacher = async (
  teacher: Omit<Teacher, "createdAt" | "departmentName">,
  accessToken: string,
) => {
  if (!accessToken) {
    return null;
  }

  const url = API_URL + "teachers/" + teacher.id;

  try {
    const { status } = await axios.patch<Teacher>(url, teacher, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return status;
  } catch (e: AxiosError | any) {
    console.log(e);
    return e.response?.status;
  }
};

export default editTeacher;
