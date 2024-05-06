import { API_URL } from "@/lib/consts";
import axios from "axios";

const addScheduleToGroups = async (
  groupIds: number[],
  file: File,
  notification: number,
  accessToken: string,
) => {
  const formData = new FormData();
  formData.append("groupIds", JSON.stringify(groupIds));
  formData.append("document", file);

  const url = API_URL + `groups/schedule?notification=${!!notification}`;

  try {
    const { status } = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return status;
  } catch (e) {
    return null;
  }
};

export default addScheduleToGroups;
