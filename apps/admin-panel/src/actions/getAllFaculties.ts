import { Faculty } from "@prisma/client";
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
