import axios from "axios";

import { Announcement } from "@/types";

const sendAnnouncement = async ({ heading, content }: Announcement) => {
  try {
    const { data } = await axios.post("/api/notifications/announcement", {
      heading,
      content,
    });

    return data;
  } catch (e) {
    return null;
  }
};

export default sendAnnouncement;
