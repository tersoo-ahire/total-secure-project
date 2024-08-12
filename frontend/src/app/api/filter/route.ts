import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const paymentStatus = searchParams.get("paymentStatus");

  const queryParams = new URLSearchParams();

  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);
  if (paymentStatus) queryParams.append("paymentStatus", paymentStatus);

  const queryString = queryParams.toString();
  const url = queryString ? `${API_BASE_URL}/filter?${queryString}` : API_BASE_URL;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error filtering invoices", error: error.message },
      { status: 500 }
    );
  }
}
