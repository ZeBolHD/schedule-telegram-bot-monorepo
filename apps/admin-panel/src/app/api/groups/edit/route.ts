import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

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
  const groupId = formData.get("groupId");
  const grade = formData.get("grade");
  const notification = Boolean(Number(formData.get("notification")));

  if (!groupId) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  if (!document && grade) {
    const group = await prisma.group.update({
      where: {
        id: Number(groupId),
      },
      data: {
        grade: Number(grade),
      },
    });

    return NextResponse.json({ group });
  }

  try {
    const formData = new FormData();
    formData.append("document", document as Blob);
    formData.append("chat_id", TELEGRAM_UPLOAD_CHATID);

    const { data } = await axios.post(TELEGRAM_SENDDOCUMENT_URL, formData);

    const file_id = data.result.document.file_id;

    const group = await prisma.group.update({
      where: {
        id: Number(groupId),
      },
      data: {
        fileId: file_id,
        grade: Number(grade),
      },
    });

    if (notification) {
      const users = await prisma.userWithGroup.findMany({
        where: {
          groupId: Number(groupId),
        },

        select: {
          userId: true,
        },
      });

      const groupChatIds = users.map((user) => user.userId);

      const usersWithGroupSubscription =
        await prisma.userWithSubscription.findMany({
          where: {
            userId: {
              in: groupChatIds,
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

      const chatIds = groupChatIds.filter((chatId) =>
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
