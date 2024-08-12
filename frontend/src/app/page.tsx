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
import { BsFileEarmarkPlusFill, BsFilter } from "react-icons/bs";
import InvoiceCard from "@/components/InvoiceCard";
import { ToastAction } from "@/components/ui/toast";
import { FaXmark } from "react-icons/fa6";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const fetcher = (url: string) => axios.get(url).then((res) => res.data.data);

export default function Home() {
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState<boolean>(false);
  const [formState, setFormState] = useState({
    customerName: "",
    invoiceNumber: "",
    totalAmount: 0,
    paymentStatus: "paid",
    files: [],
  });
  const [filterState, setFilterState] = useState({
    paymentStatus: "",
    startDate: "",
    endDate: "",
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [filteredInvoices, setFilteredInvoices] = useState<any>(null);

  // Fetch all invoices
  const { data: invoiceData, error: invoiceError } = useSWR(
    `${API_BASE_URL}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  const fetchFilteredInvoices = async () => {
    try {
      const { paymentStatus, startDate, endDate } = filterState;

      // Format dates to ISO 8601 format (if not empty)
      const formattedStartDate = startDate
        ? new Date(startDate).toISOString().split("T")[0]
        : "";
      const formattedEndDate = endDate
        ? new Date(endDate).toISOString().split("T")[0]
        : "";

      // Create an object with only the existing parameters
      const params: Record<string, string> = {};
      if (paymentStatus) params.paymentStatus = paymentStatus;
      if (formattedStartDate) params.startDate = formattedStartDate;
      if (formattedEndDate) params.endDate = formattedEndDate;

      const query = new URLSearchParams(params).toString();

      const response = await axios.get(`${API_BASE_URL}/filter?${query}`);
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFetching(true);
    try {
      const response = await fetchFilteredInvoices();
      if (response?.status === 200) {
        setFilteredInvoices(response.data.data);
        setIsFilterDialogOpen(false);
        toast({
          title: "Filtered data successfully",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Filtering failed.",
        description: "There was a problem applying the filter.",
        action: <ToastAction altText="Report Issue">Report Issue</ToastAction>,
      });
    }
    setIsFetching(false);
  };

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

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFilterState((prevState) => ({
      ...prevState,
      [name]: value,
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
        <div className="flex flex-col gap-4 md:flex-row">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-dark-green hover:cursor-pointer hover:bg-dark-green/90">
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

          <Dialog
            open={isFilterDialogOpen}
            onOpenChange={setIsFilterDialogOpen}
          >
            <DialogTrigger className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-dark-green hover:cursor-pointer hover:bg-dark-green/90">
              <p className="text-base font-bold text-white">Filter Invoices</p>
              <BsFilter className="w-5 h-5 text-white" />
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader className="gap-0">
                <DialogTitle className="text-xl font-bold">
                  Filter Invoices
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Set filters to narrow down your invoice list
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleFilterSubmit}>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Payment Status
                    </label>
                    <select
                      name="paymentStatus"
                      value={filterState.paymentStatus}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-dark-blue focus:border-dark-blue"
                    >
                      <option value="">Select status</option>
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={filterState.startDate}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-dark-blue focus:border-dark-blue"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={filterState.endDate}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-dark-blue focus:border-dark-blue"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 font-bold text-white rounded-md bg-dark-green hover:bg-dark-green/90"
                  >
                    Apply Filters
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          {filteredInvoices ? (
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-3 py-1 text-sm font-medium text-white rounded-md bg-color-bright-red hover:bg-color-bright-red/80"
              onClick={() => setFilteredInvoices(null)}
            >
              Remove Filter
              <span className="text-base mb-[0.2em]">
              <FaXmark />
              </span>
            </button>
          ) : null}
        </div>

        <div className="my-8 border-t border-gray-400"></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {isFetching ? (
            <p>Updating invoice list...</p>
          ) : filteredInvoices ? (
            filteredInvoices.map((invoice: any) => (
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

          {filteredInvoices?.length === 0 ? <p>No results found</p> : null}
        </div>
      </div>
    </main>
  );
}
