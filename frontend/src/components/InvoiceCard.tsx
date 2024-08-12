import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useState } from "react";
import { mutate } from "swr";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const InvoiceCard = ({
  id,
  customerName,
  invoiceNumber,
  dateCreated,
  totalAmount,
  paymentStatus,
  files,
  setIsFetching,
}: {
  id: number;
  customerName: string;
  invoiceNumber: string;
  dateCreated: string;
  totalAmount: number;
  paymentStatus: string;
  files: { fileName: string; filePath: string }[];
  setIsFetching: (value: any) => void;
}) => {
  const { toast } = useToast();
  const [deleting, setDeleting] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [editFormState, setEditFormState] = useState<any>(null);
  const [editing, setEditing] = useState<boolean>(false);

  const handleEdit = (invoice: any) => {
    setEditFormState(invoice);
    setIsEditDialogOpen(true);
  };

  const handleEditInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setEditFormState((prevState: any) => ({
      ...prevState,
      [name]: name === "totalAmount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(true);
    try {
      const response = await axios.patch(
        `/api/${editFormState.id}`,
        editFormState
      );

      if (response.status === 200) {
        toast({
          title: "Invoice updated successfully",
        });
        setIsEditDialogOpen(false);
        setEditFormState(null);
        setIsFetching(true);
        await mutate(`${API_BASE_URL}`);
      }
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Invoice update failed.",
        description: "There was a problem updating the invoice",
        action: <ToastAction altText="Report Issue">Report Issue</ToastAction>,
      });
    }
    setEditing(false);
    setIsFetching(false);
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const response = await axios.delete(`/api/${id}`);
      if (response.status === 200) {
        toast({
          title: "Invoice deleted successfully",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Invoice deletion failed.",
        description: `There was a problem deleting invoice ${invoiceNumber}`,
        action: <ToastAction altText="Report Issue">Report Issue</ToastAction>,
      });
      throw new Error(error.message);
    }
    setDeleting(false);
  };

  return (
    <div className="bg-white px-3 py-4 md:px-6 border-[1.5px] border-dark-green/20 items-center justify-center flex flex-col border-dashed gap-4 rounded-lg">
      <div className="flex flex-col items-start justify-between w-full space-y-3 md:flex-row">
        <div className="flex flex-col md:space-y-1">
          <p className="text-base font-bold">
            Invoice Number:{" "}
            <span className="font-normal text-gray-600">{invoiceNumber}</span>
          </p>
          <p className="text-base font-bold">
            Date Created:{" "}
            <span className="font-normal text-gray-600">{dateCreated}</span>
          </p>
          <p className="text-base font-bold">
            Total Amount:{" "}
            <span className="font-normal text-gray-600">{totalAmount}</span>
          </p>
          <div className="flex gap-2 text-base font-bold">
            Payment Status:
            <div
              className={`flex items-center justify-center w-max px-2.5 py-0.5 text-xs text-white font-semibold rounded-md ${
                paymentStatus.toLowerCase() === "unpaid"
                  ? "bg-color-bright-red"
                  : "bg-light-green"
              }`}
            >
              {paymentStatus}
            </div>
          </div>
          <p className="text-base font-bold">
            Customer Name:{" "}
            <span className="font-normal text-gray-600">{customerName}</span>
          </p>
          <p className="text-base font-bold">
            Files:{" "}
            {files.map((file, index) => (
              <span
                key={index}
                className="font-normal text-blue-700 hover:underline"
              >
                <a href={file.filePath}>{file.fileName}</a>
                {index < files.length - 1 && ", "}
              </span>
            ))}
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between w-full gap-2">
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger
            className="flex items-center justify-center w-1/2 gap-2 px-3 py-1 rounded-md bg-dark-green hover:cursor-pointer hover:bg-dark-green/90"
            onClick={() =>
              handleEdit({
                id,
                customerName,
                invoiceNumber,
                totalAmount,
                paymentStatus,
              })
            }
          >
            <p className="text-sm font-medium text-white">Edit</p>
            <FaEdit className="text-base mb-[0.2em] text-white" />
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader className="gap-0">
              <DialogTitle className="text-xl font-bold">
                Edit Invoice
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Update the fields to edit this invoice
              </DialogDescription>
            </DialogHeader>

            {/* FORM */}
            <form onSubmit={handleEditSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={editFormState?.customerName || ""}
                    onChange={handleEditInputChange}
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
                    value={editFormState?.invoiceNumber || ""}
                    onChange={handleEditInputChange}
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
                    value={editFormState?.totalAmount || 0}
                    onChange={handleEditInputChange}
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
                    value={editFormState?.paymentStatus || "paid"}
                    onChange={handleEditInputChange}
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
                  {editing ? "Updating..." : "Update Invoice"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <button
          type="submit"
          className="flex items-center justify-center w-1/2 gap-2 px-3 py-1 text-sm font-medium text-white rounded-md bg-color-bright-red hover:bg-color-bright-red/80"
          onClick={handleDelete}
        >
          {!deleting ? <>Delete</> : <>Deleting...</>}
          <span className="text-base mb-[0.2em]">
            <RiDeleteBin6Fill />
          </span>
        </button>
      </div>
    </div>
  );
};

export default InvoiceCard;
