import { API_URL } from "@/lib/consts";
import { Group } from "@repo/database";
import axios from "axios";

const editGroup = async (
  groupId: number,
  notification: number,
  file: File | null,
  grade: number,
  accessToken: string,
) => {
  try {
    const formData = new FormData();
    formData.append("grade", String(grade));

    if (file) {
      formData.append("document", file, file.name);
    }

    const url = API_URL + `groups/${groupId}?notification=${!!notification}`;

    const { data } = await axios.patch<Group>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return data;
  } catch (e) {
    return null;
  }
};

export default editGroup;
