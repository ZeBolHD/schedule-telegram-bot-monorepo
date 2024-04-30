import { Faculty } from "@repo/database";
import axios from "axios";

const getAllFaculties = async () => {
  try {
    const { data } = await axios.get<Faculty[]>("/api/faculties");
    return data;
  } catch (e) {
    return null;
  }
};

export default getAllFaculties;
