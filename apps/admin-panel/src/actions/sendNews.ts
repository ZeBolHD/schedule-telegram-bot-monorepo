import axios from "axios";

import { News } from "@/types";

export const sendNews = async ({ heading, content, images }: News) => {
  const formData = new FormData();

  formData.append("heading", heading);
  formData.append("content", content);

  for (let image of images) {
    formData.append("image", image);
  }

  try {
    const { data } = await axios.post("/api/notifications/news", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (e) {
    return null;
  }
};
