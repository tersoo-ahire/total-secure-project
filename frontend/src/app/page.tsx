"use client";

import useSWR, { mutate } from "swr";
import axios from "axios";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
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
import { ToastAction } from "@/components/ui/toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const fetcher = (url: string) => axios.get(url).then((res) => res.data.data);

export default function Home() {
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [formState, setFormState] = useState({
    customerName: "",
    invoiceNumber: "",
    totalAmount: 0,
    paymentStatus: "paid",
    files: [],
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // Fetch all invoices
  const { data: invoiceData, error: invoiceError } = useSWR(
    `${API_BASE_URL}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  // Fetch paid invoices
  const { data: paidInvoices, error: paidError } = useSWR(
    "/api/filter?paymentStatus=paid",
    fetcher
  );

  // Fetch unpaid invoices
  const { data: unpaidInvoices, error: unpaidError } = useSWR(
    "/api/filter?paymentStatus=unpaid",
    fetcher
  );

  if (invoiceError || paidError || unpaidError) {
    return (
      <div className="flex items-center justify-center w-screen h-screen text-lg font-semibold">
        Failed to load invoices.
      </div>
    );
  }

  if (!invoiceData || !paidInvoices || !unpaidInvoices) {
    return (
      <div className="flex items-center justify-center w-screen h-screen text-lg font-semibold">
        Loading...
      </div>
    );
  }

  // Function to handle form input changes
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: name === "totalAmount" ? parseFloat(value) || 0 : value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { customerName, invoiceNumber, totalAmount, paymentStatus, files } =
        formState;
      const response = await axios.post("/api/create", {
        customerName,
        invoiceNumber,
        totalAmount: Number(totalAmount),
        paymentStatus,
        files,
      });

      if (response.status === 201) {
        toast({
          title: "Invoice created successfully",
        });
        setIsDialogOpen(false);
        setFormState({
          customerName: "",
          invoiceNumber: "",
          totalAmount: 0,
          paymentStatus: "paid",
          files: [],
        });
        setIsFetching(true);
        await mutate(`${API_BASE_URL}`);
      }
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Invoice creation failed.",
        description: "There was a problem creating a new invoice",
        action: <ToastAction altText="Report Issue">Report Issue</ToastAction>,
      });
    }
    setSubmitting(false);
    setIsFetching(false);
  };

  return (
    <main className="p-4 md:p-5">
      <div>
        <h1 className="mb-4 text-3xl font-bold">Invoice Management System</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <div className="p-4 text-center text-white rounded-tl-lg rounded-tr-lg bg-dark-green">
              <p className="text-base">Total Invoices</p>
            </div>
            <div className="p-4 text-center text-white rounded-bl-lg rounded-br-lg bg-light-green">
              <h2 className="mb-2 text-2xl font-bold">
                {invoiceData.length || 0}
              </h2>
            </div>
          </div>

          <div>
            <div className="p-4 text-center text-white rounded-tl-lg rounded-tr-lg bg-dark-green">
              <p className="text-base">Paid Invoices</p>
            </div>
            <div className="p-4 text-center text-white rounded-bl-lg rounded-br-lg bg-light-green">
              <h2 className="mb-2 text-2xl font-bold">
                {paidInvoices.data.length || 0}
              </h2>
            </div>
          </div>

          <div>
            <div className="p-4 text-center text-white rounded-tl-lg rounded-tr-lg bg-dark-green">
              <p className="text-base">Unpaid Invoices</p>
            </div>
            <div className="p-4 text-center text-white rounded-bl-lg rounded-br-lg bg-light-green">
              <h2 className="mb-2 text-2xl font-bold">
                {unpaidInvoices.data.length || 0}
              </h2>
            </div>
          </div>
        </div>

        <div className="my-8 border-t border-gray-400"></div>

        <h1 className="mb-4 text-3xl font-bold">Your Invoices</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-dark-green hover:cursor-pointer hover:bg-dark-green/90">
            <p className="text-base font-bold text-white">Create new Invoice</p>
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
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formState.customerName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-dark-green focus:border-dark-green"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    name="invoiceNumber"
                    value={formState.invoiceNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-dark-green focus:border-dark-green"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Total Amount
                  </label>
                  <input
                    type="number"
                    name="totalAmount"
                    value={formState.totalAmount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-dark-green focus:border-dark-green"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Payment Status
                  </label>
                  <select
                    name="paymentStatus"
                    value={formState.paymentStatus}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-dark-green focus:border-dark-green"
                    required
                  >
                    <option value="">Select status</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>
              </div>
              {/* Optionally, add a file input for uploading files */}
              <div className="mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white rounded-md bg-dark-green hover:bg-dark-green/90"
                >
                  {!submitting ? <>Create Invoice</> : <>Submitting...</>}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <div className="my-8 border-t border-gray-400"></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {isFetching ? (
            <p>Updating invoice list...</p>
          ) : (
            invoiceData.map((invoice: any) => (
              <InvoiceCard
                key={invoice.id}
                id={invoice.id}
                customerName={invoice.customerName}
                invoiceNumber={invoice.invoiceNumber}
                dateCreated={invoice.dateCreated}
                totalAmount={invoice.totalAmount}
                paymentStatus={invoice.paymentStatus}
                files={invoice.files}
                setIsFetching={setIsFetching}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
