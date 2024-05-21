import { API_URL } from "@/lib/consts";
import axios from "axios";

const deleteTeacher = async (id: number, accessToken: string) => {
  if (!accessToken) {
    return null;
  }

  const url = API_URL + "teachers/" + id;

  try {
    const { status } = await axios.delete(url, {
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

export default deleteTeacher;
