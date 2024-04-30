import axios from "axios";

const addScheduleToGroups = async (
  groupIds: number[],
  file: File,
  notification: number
) => {
  const formData = new FormData();
  formData.append("groupIds", JSON.stringify(groupIds));
  formData.append("notification", String(notification));
  formData.append("document", file);

  const url = "/api/schedule";

  try {
    const { status } = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return status;
  } catch (e) {
    return null;
  }
};

export default addScheduleToGroups;
