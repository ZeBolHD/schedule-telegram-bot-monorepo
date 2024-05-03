import { getServerSession } from "next-auth/next";

import authOptions from "@/app/api/auth/[...nextauth]/options";

const checkIsSessionAuthorized = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return false;
  }

  return true;
};

export default checkIsSessionAuthorized;
