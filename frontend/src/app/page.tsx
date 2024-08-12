"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BsFileEarmarkPlusFill } from "react-icons/bs";
import InvoiceCard from "@/components/InvoiceCard";
import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) =>
  axios.get(url).then((res) => res.data.data.data);

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const {
    data: invoiceData,
    error,
    mutate,
  } = useSWR("/api/getAllInvoices", fetcher, {
    revalidateOnReconnect: true,
    revalidateOnFocus: true,
  });

  if (error) {
    return (
      <div className="flex items-center justify-center w-screen h-screen text-lg font-semibold">
        Failed to load invoices.
      </div>
    );
  }

  return (
    <>
      {invoiceData ? (
        <main className="p-4 md:p-5">
          <div>
            <h1 className="mb-4 text-3xl font-bold">
              Invoice Management System
            </h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <div className="p-4 text-center text-white rounded-tl-lg rounded-tr-lg bg-dark-green">
                  <p className="text-base">Total Invoices</p>
                </div>
                <div className="p-4 text-center text-white rounded-bl-lg rounded-br-lg bg-light-green">
                  <h2 className="mb-2 text-2xl font-bold">
                    {invoiceData?.length}
                  </h2>
                </div>
              </div>

              <div>
                <div className="p-4 text-center text-white rounded-tl-lg rounded-tr-lg bg-dark-green">
                  <p className="text-base">Paid Invoices</p>
                </div>
                <div className="p-4 text-center text-white rounded-bl-lg rounded-br-lg bg-light-green">
                  <h2 className="mb-2 text-2xl font-bold">10</h2>
                </div>
              </div>

              <div>
                <div className="p-4 text-center text-white rounded-tl-lg rounded-tr-lg bg-dark-green">
                  <p className="text-base">Unpaid Invoices</p>
                </div>
                <div className="p-4 text-center text-white rounded-bl-lg rounded-br-lg bg-light-green">
                  <h2 className="mb-2 text-2xl font-bold">10</h2>
                </div>
              </div>

              <div></div>
            </div>

            <div className="my-8 border-t border-gray-400"></div>

            <h1 className="mb-4 text-3xl font-bold">Your Invoices</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger className="flex gap-2 items-center justify-center px-4 py-2 bg-dark-green rounded-md hover:cursor-pointer hover:bg-dark-green/90">
                <p className="text-base font-bold text-white">
                  Create new Invoice
                </p>
                <BsFileEarmarkPlusFill className="w-5 h-5 text-white" />
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader className="gap-0">
                  <DialogTitle className="text-xl font-bold">
                    Create Invoice
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Fill in the fields to create a new invoice
                  </DialogDescription>
                </DialogHeader>
                {/* FORM */}
              </DialogContent>
            </Dialog>

            <div className="my-8 border-t border-gray-400"></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {invoiceData?.map((invoice: any) => (
                <InvoiceCard
                  key={invoice.id}
                  id={invoice.id}
                  customerName={invoice.customerName}
                  invoiceNumber={invoice.invoiceNumber}
                  dateCreated={invoice.date}
                  paymentStatus={invoice.paymentStatus}
                  files={[
                    {
                      fileName: "invoice1",
                      filePath: "https://tersoo.netlify.app/",
                    },
                    {
                      fileName: "invoice2",
                      filePath: "https://tersoo.netlify.app/",
                    },
                  ]}
                />
              ))}
            </div>
          </div>
        </main>
      ) : (
        <div className="flex items-center justify-center w-screen h-screen text-lg font-semibold">
          Loading...
        </div>
      )}
    </>
  );
}
