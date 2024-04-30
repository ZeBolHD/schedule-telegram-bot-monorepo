import { getServerSession } from "next-auth";

import authOptions from "@/app/api/auth/[...nextauth]/options";

const getSession = async () => {
  return await getServerSession(authOptions);
};

export default getSession;
