import React, { useEffect, useState } from "react";
import { IoMdTrash } from "react-icons/io";
import CustomImageUpload from "@/components/Common/CustomImageUpload";
import { isArray } from "@/utils/utils";

interface ReportImagesProps {
  initialImages?: string[]; // URLs or base64 strings of the images
  onChange: (images: string[]) => void;
}

const ReportImages: React.FC<ReportImagesProps> = ({
  initialImages = [],
  onChange,
}) => {
  const [uploads, setUploads] = useState<any[]>([]);

  const handleOnChange = (filter: any[]) => {
    const images = filter.map((item) => {
      return item.file;
    });
    onChange(images);
  };

  const handleAddUpload = () => {
    setUploads([...uploads, { id: Date.now(), file: "" }]);
  };

  const handleSetFile = (id: number, value: string) => {
    const updatedUploads = uploads.map((upload) =>
      upload.id === id ? { ...upload, file: value } : upload,
    );
    setUploads(updatedUploads);
    handleOnChange(updatedUploads);
  };

  const handleRemoveUpload = (id: number) => {
    const filter = uploads.filter((upload) => upload.id !== id);
    setUploads(filter);
    handleOnChange(filter);
  };

  useEffect(() => {
    if (!isArray(uploads) && isArray(initialImages)) {
      const arr = initialImages?.map((img, index) => ({
        id: Date.now() + index, // Create unique ids for initial images
        file: img,
      }));
      setUploads(arr);
    }
  }, [initialImages]);

  return (
    <div className="flex flex-wrap gap-10">
      {isArray(uploads) &&
        uploads.map((upload, index) => (
          <div key={upload.id} className="relative">
            <CustomImageUpload
              label={`Upload ${index + 1}`}
              value={upload.file}
              setValue={(value) => handleSetFile(upload.id, value)}
            />
            <IoMdTrash
              className="absolute -top-2 -right-2 mt-2 mr-2 text-red-500 cursor-pointer"
              size={24}
              onClick={() => handleRemoveUpload(upload.id)}
            />
          </div>
        ))}
      <button
        className="mt-4 p-1.5 bg-blue-500 text-white text-sm h-fit  rounded"
        onClick={handleAddUpload}
      >
        Upload
      </button>
    </div>
  );
};

export default ReportImages;
