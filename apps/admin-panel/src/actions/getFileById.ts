import { API_URL } from "@/lib/consts";
import axios from "axios";

export const getFileById = async (fileId: string) => {
  try {
    const { data } = await axios.get(API_URL + `files/${fileId}`);
    return data;
  } catch (error) {
    return null;
  }
};
