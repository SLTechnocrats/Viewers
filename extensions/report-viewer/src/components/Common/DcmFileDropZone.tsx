import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { isArray, isStr } from "@/utils/utils";
import { showErrorToast, showSuccessToast } from "@/utils/notify";
import { api } from "@/api/api";
interface OwnProps {
  onStudyUploaded?: any;
  setIsLoading?: ((value: boolean) => void) | undefined;
}

type Props = OwnProps;

const DcmFileDropZone: React.FC<Props> = () => {
  const onDrop = useCallback(async (acceptedFiles: any) => {
    if (isArray(acceptedFiles)) {
      const file = acceptedFiles[0];
      if (file === undefined || file === null) {
        showErrorToast("Invalid file");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      const headers = {
        "Content-Type": "multipart/form-data",
      };
      const { status: apiStatus, data: apiData } = await api.post(
        api.endpoints.dicom.upload,
        formData,
        headers,
      );
      if (apiStatus === 200) {
        const { statusCode, error } = apiData;
        if (statusCode === 200) {
          showSuccessToast("File Successfully Uploaded");
        }
        if (statusCode === 404) {
          if (isStr(error.message)) {
            showErrorToast("DCM file upload failed,please try again");
          }
        }
      }
    } else {
      showErrorToast("Invalid file selected");
    }
    // Do something with the files
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  return (
    <div className="container bg-[#F7FAFF] rounded-lg w-full flex justify-center h-[5rem] items-center border border-dashed border-gray-300">
      <div {...getRootProps()}>
        <input className="text-black" {...getInputProps()} />
        {isDragActive ? (
          <p className="text-gray-800">Drop the file here ...</p>
        ) : (
          <p className="text-gray-800">
            Drag and drop .dcm or zip here, or click to select file
          </p>
        )}
      </div>
    </div>
  );
};

export default DcmFileDropZone;
