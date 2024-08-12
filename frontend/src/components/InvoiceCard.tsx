import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import axios from "axios";

const InvoiceCard = ({
  id,
  customerName,
  invoiceNumber,
  dateCreated,
  paymentStatus,
  files,
}: {
  id: number;
  customerName: string;
  invoiceNumber: string;
  dateCreated: string;
  paymentStatus: string;
  files: { fileName: string; filePath: string }[];
}) => {
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/${id}`);
      if (response.status === 204) {
        alert("Deleted Successfully");
      }
    } catch (error: any) {
      alert("Oops. Something went wrong!");
      throw new Error(error.message);
    }
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
        <button type="submit" className="w-1/2 gap-2 font-semibold font-base">
          Edit
          <span className="text-base mb-[0.2em]">
            <FaEdit />
          </span>
        </button>
        <button
          type="submit"
          className="bg-color-bright-red hover:bg-color-bright-red/80 w-1/2 gap-2 font-semibold font-base"
          onClick={handleDelete}
        >
          Delete
          <span className="text-base mb-[0.2em]">
            <RiDeleteBin6Fill />
          </span>
        </button>
      </div>
    </div>
  );
};

export default InvoiceCard;
