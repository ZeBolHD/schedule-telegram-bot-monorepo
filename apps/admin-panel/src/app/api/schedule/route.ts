import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { TELEGRAM_SENDDOCUMENT_URL, TELEGRAM_UPLOAD_CHATID } from "@/consts";
import prisma from "@/libs/prismadb";

import checkIsSessionAuthorized from "@/libs/checkSessionAuthorized";

export async function POST(req: NextRequest) {
  const isSessionAuthorized = await checkIsSessionAuthorized();

  if (!isSessionAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const document = formData.get("document");
  const groupIdsString = formData.get("groupIds") as string;
  const notificationString = formData.get("notification");

  const groupIds = JSON.parse(groupIdsString) as number[];
  const notification = Boolean(Number(notificationString));

  if (!groupIds) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  try {
    const formData = new FormData();
    formData.append("document", document as Blob);
    formData.append("chat_id", TELEGRAM_UPLOAD_CHATID);

    const { data } = await axios.post(TELEGRAM_SENDDOCUMENT_URL, formData);

    const file_id = data.result.document.file_id;

    const group = await prisma.group.updateMany({
      where: {
        id: {
          in: groupIds,
        },
      },
      data: {
        fileId: file_id,
      },
    });

    if (notification) {
      const users = await prisma.userWithGroup.findMany({
        where: {
          groupId: {
            in: groupIds,
          },
        },

        select: {
          userId: true,
        },
      });

      const groupsChatIds = users.map((user) => user.userId);

      const usersWithGroupSubscription =
        await prisma.userWithSubscription.findMany({
          where: {
            userId: {
              in: groupsChatIds,
            },
            subscriptionId: 1,
          },
          select: {
            userId: true,
          },
        });

      const usersWithGroupSubscriptionIds = usersWithGroupSubscription.map(
        (user) => user.userId
      );

      const chatIds = groupsChatIds.filter((chatId) =>
        usersWithGroupSubscriptionIds.includes(chatId)
      );

      if (chatIds.length > 0) {
        const text = "Ваше расписание изменено!";

        for (let chatId of chatIds) {
          const url = TELEGRAM_SENDDOCUMENT_URL;
          await axios.post(url, {
            chat_id: chatId,
            document: file_id,
            caption: text,
          });
        }
      }
    }

    return NextResponse.json({ group });
  } catch (e) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
