import { NextRequest, NextResponse } from "next/server";
import { isAuthorised } from "@/lib/auth";
import { createEnquiry, listEnquiries } from "@/lib/cms/enquiries";
import { sendEnquiryEmail } from "@/lib/mailer";

export async function GET(request: NextRequest) {
  if (!isAuthorised(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const enquiries = await listEnquiries();
    return NextResponse.json(enquiries);
  } catch (err) {
    console.error("enquiries GET:", err);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, service, budget, message } = body;

    if (!name || !email || !service || !budget) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = await createEnquiry({ name, email, phone, company, service, budget, message });

    const submittedAt = new Date().toLocaleString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit", timeZoneName: "short",
    });

    try {
      await sendEnquiryEmail({ name, email, phone, company, service, budget, message, submittedAt });
    } catch (mailErr) {
      console.error("Email send failed (enquiry saved):", mailErr);
    }

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (err) {
    console.error("enquiries POST:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
