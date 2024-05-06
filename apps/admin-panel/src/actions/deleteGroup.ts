import { API_URL } from "@/lib/consts";
import axios from "axios";

const deleteGroup = async (groupId: number, accessToken: string) => {
  await axios.delete(API_URL + "groups/" + groupId, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export default deleteGroup;
