import { NextResponse } from "next/server";

import prisma from "@/libs/prismadb";

import checkIsSessionAuthorized from "@/libs/checkSessionAuthorized";

export async function GET() {
  const isSessionAuthorized = await checkIsSessionAuthorized();

  if (!isSessionAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.telegramUser.findMany({
    include: {
      userWithGroup: {
        select: {
          group: {
            select: {
              code: true,
            },
          },
        },
      },
      _count: {
        select: {
          userWithGroup: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(users);
}
