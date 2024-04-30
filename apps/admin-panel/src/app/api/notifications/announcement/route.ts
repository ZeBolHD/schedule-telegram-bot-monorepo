import axios from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/libs/prismadb";
import { TELEGRAM_SENDMESSAGE_URL } from "@/consts";
import checkIsSessionAuthorized from "@/libs/checkSessionAuthorized";

export async function POST(req: NextRequest) {
  const isSessionAuthorized = await checkIsSessionAuthorized();

  if (!isSessionAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { heading, content } = body;

  if (!heading || !content) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const users = await prisma.userWithSubscription.findMany({
    where: {
      subscriptionId: 2,
    },
    select: {
      userId: true,
    },
  });

  const chatIds = users.map((user) => user.userId);

  const text = `*${heading}*` + "\n\n" + content;

  for (const chatId of chatIds) {
    await axios.post(TELEGRAM_SENDMESSAGE_URL, {
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown",
    });
  }

  return NextResponse.json({ status: "Success" }, { status: 200 });
}
