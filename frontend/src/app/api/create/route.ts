import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(req: NextRequest) {
  try {
    const { customerName, invoiceNumber, totalAmount, paymentStatus, files } =
      await req.json();

    const parsedTotalAmount =
      typeof totalAmount === "string" ? parseFloat(totalAmount) : totalAmount;

    const response = await axios.post(`${API_BASE_URL}`, {
      customerName,
      invoiceNumber,
      totalAmount: parsedTotalAmount,
      paymentStatus,
      files,
    });

    return NextResponse.json(
      {
        message: "Invoice created successfully",
        data: response.data,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error creating invoice",
        error: error.response?.data || error.message,
      },
      {
        status: 500,
      }
    );
  }
}
