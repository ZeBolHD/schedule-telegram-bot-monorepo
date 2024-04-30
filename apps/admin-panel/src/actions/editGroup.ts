import { Group } from "@prisma/client";
import axios from "axios";

const editGroup = async (
  groupId: number,
  notification: number,
  file?: File,
  grade?: number
) => {
  try {
    const formData = new FormData();
    formData.append("groupId", String(groupId));
    formData.append("notification", String(notification));
    formData.append("grade", String(grade));

    if (file) {
      formData.append("document", file, file.name);
    }

    const url = "/api/groups/edit";

    const { data } = await axios.post<Group>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (e) {
    return null;
  }
};

export default editGroup;
