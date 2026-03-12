import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ redirect: "/report-data.json" }, { status: 200 });
}
