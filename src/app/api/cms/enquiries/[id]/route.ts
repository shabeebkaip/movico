import { NextRequest, NextResponse } from "next/server";
import { isAuthorised } from "@/lib/auth";
import { deleteEnquiry, updateEnquiryStatus } from "@/lib/cms/enquiries";
import type { EnquiryStatus } from "@/lib/cms/enquiries";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorised(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const { status } = await request.json() as { status: EnquiryStatus };
    await updateEnquiryStatus(id, status);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("enquiry PATCH:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorised(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    await deleteEnquiry(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("enquiry DELETE:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
