import {
  handleFileUpload,
} from "@/services/upload-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { files } = await handleFileUpload(req);
    return NextResponse.json({
      files,
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
