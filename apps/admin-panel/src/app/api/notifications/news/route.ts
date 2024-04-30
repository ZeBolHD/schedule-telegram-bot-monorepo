import axios from "axios";

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/libs/prismadb";

import {
  TELEGRAM_SENDMEDIAGROUP_URL,
  TELEGRAM_SENDMESSAGE_URL,
  TELEGRAM_SENDPHOTO_URL,
} from "@/consts";
import { Media } from "@/types";

import checkIsSessionAuthorized from "@/libs/checkSessionAuthorized";

export async function POST(req: NextRequest) {
  const isSessionAuthorized = await checkIsSessionAuthorized();

  if (!isSessionAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reqFormData = await req.formData();

  const heading = reqFormData.get("heading") as string;
  const content = reqFormData.get("content") as string;
  const images = reqFormData.getAll("image") as Blob[];

  const text = `*${heading}*` + "\n\n" + content;

  let fileIds: string[] = [];

  const isWithMedia = images.length !== 0;

  const url = isWithMedia
    ? TELEGRAM_SENDMEDIAGROUP_URL
    : TELEGRAM_SENDMESSAGE_URL;

  let media: Media[] = [];

  if (isWithMedia) {
    for (let image of images) {
      const f = new FormData();
      f.append("chat_id", "721618175");
      f.append("photo", image);

      const { data } = await axios.post(TELEGRAM_SENDPHOTO_URL, f, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fileIds.push(data.result.photo[0].file_id);
    }

    media = fileIds.map((id) => ({
      type: "photo",
      media: id,
    }));

    media[0] = { ...media[0], caption: text, parse_mode: "Markdown" };
  }

  const users = await prisma.userWithSubscription.findMany({
    where: {
      subscriptionId: 3,
    },
  });

  const chadIds = users.map((user) => user.userId);

  for (const chatId of chadIds) {
    await axios.post(url, {
      chat_id: chatId,
      text: text,
      media,
      parse_mode: "Markdown",
    });
  }

  return NextResponse.json({ status: "Test" }, { status: 200 });
}
