import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Retrieve parameters
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const paymentStatus = searchParams.get("paymentStatus");

  // Create URLSearchParams object for query parameters
  const queryParams = new URLSearchParams();

  // Add parameters to query string if they are valid and not empty
  if (paymentStatus && paymentStatus.trim()) {
    queryParams.append("paymentStatus", paymentStatus);
  }
  if (startDate && startDate.trim()) {
    queryParams.append("startDate", startDate);
  }
  if (endDate && endDate.trim()) {
    queryParams.append("endDate", endDate);
  }

  // Construct the query string and URL
  const queryString = queryParams.toString();
  const url = queryString
    ? `${API_BASE_URL}/filter?${queryString}`
    : `${API_BASE_URL}/filter`;

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
