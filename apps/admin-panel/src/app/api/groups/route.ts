import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import prisma from "@/lib/prismadb";
import checkIsSessionAuthorized from "@/lib/checkSessionAuthorized";

export async function GET() {
  const isSessionAuthorized = await checkIsSessionAuthorized();

  if (!isSessionAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const groups = await prisma.group.findMany({
    include: {
      faculty: true,
      _count: {
        select: {
          userWithGroup: true,
        },
      },
    },

    orderBy: {
      id: "asc",
    },
  });

  return NextResponse.json(groups);
}
