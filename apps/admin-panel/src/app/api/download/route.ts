import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

import { TELEGRAM_DOWNLOAD_URL, TELEGRAM_GETFILE_URL } from "@/consts";

import checkIsSessionAuthorized from "@/libs/checkSessionAuthorized";

export async function GET(req: NextRequest) {
  const isSessionAuthorized = await checkIsSessionAuthorized();

  if (!isSessionAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const fileId = req.nextUrl.searchParams.get("file_id");

  if (!fileId) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  try {
    const { data: filePathData } = await axios.get(
      TELEGRAM_GETFILE_URL + fileId
    );
    const filePath = filePathData.result.file_path;

    const res = await axios.get(TELEGRAM_DOWNLOAD_URL + filePath);

    const file = res.data;

    return new NextResponse(file, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filePath}"`,
      },
    });
  } catch (e: AxiosError | any) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
