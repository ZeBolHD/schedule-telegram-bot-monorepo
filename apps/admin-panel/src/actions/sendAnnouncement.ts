import axios from "axios";

import { Announcement } from "@/types";
import { API_URL } from "@/lib/consts";

const sendAnnouncement = async (announcement: Announcement, accessToken: string) => {
  try {
    const { status } = await axios.post(API_URL + "notifications/announcement", announcement, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return status;
  } catch (e) {
    return null;
  }
};

export default sendAnnouncement;
