import { NextResponse } from "next/server";

import prisma from "@/lib/prismadb";

import checkIsSessionAuthorized from "@/lib/checkSessionAuthorized";

export async function GET() {
  const isSessionAuthorized = await checkIsSessionAuthorized();

  if (!isSessionAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const faculties = await prisma.faculty.findMany({});

  return NextResponse.json(faculties);
}
