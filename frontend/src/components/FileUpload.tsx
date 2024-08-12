import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const FileUpload = ({
  onFileUpload,
}: {
  onFileUpload: (file: any) => void;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const uploadFile = async () => {
    if (selectedFile) {
      const { data, error } = await supabase.storage
        .from("invoice-files")
        .upload(`public/${selectedFile.name}`, selectedFile);

      if (error) {
        console.error("Error uploading file:", error);
      } else {
        const filePath = data?.path || "";
        onFileUpload({ fileName: selectedFile.name, filePath });
        setSelectedFile(null);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>Upload File</button>
    </div>
  );
};

export default FileUpload;
