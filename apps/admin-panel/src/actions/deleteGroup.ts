import axios from "axios";

const deleteGroup = async (groupId: number) => {
  await axios.delete("/api/groups/delete?groupId=" + groupId);
};

export default deleteGroup;
