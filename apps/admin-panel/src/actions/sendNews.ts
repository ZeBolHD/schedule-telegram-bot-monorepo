import axios from "axios";

import { News } from "@/types";
import { API_URL } from "@/lib/consts";

export const sendNews = async (news: News, accessToken: string) => {
  const formData = new FormData();

  formData.append("heading", news.heading);
  formData.append("text", news.text);

  for (let image of news.images) {
    formData.append("images", image);
  }

  const url = API_URL + "notifications/news";

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
