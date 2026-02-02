import React, { useRef, useState } from "react";
import { FormikErrors, FormikTouched } from "formik";
import { showErrorToast } from "@/utils/notify";
import { api, AWS_BUCKET_URL } from "@/api/api";
import useAuth from "@/hooks/useAuth";
import { isValidUrl } from "@/utils/utils";

const MAX_SIZE = 30;

interface CustomUploaderWithSelectBoxProps {
  label: string;
  value: string;
  width?: number | string;
  setValue: (filepath: string) => void;
  errorText?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
  touched?: boolean | FormikTouched<any> | FormikTouched<any>[] | undefined;
  bottomLabel?: string;
  accept?:
    | ".png, .jpg, .jpeg, .pdf"
    | ".png"
    | ".jpg"
    | ".jpeg"
    | ".pdf"
    | ".png, .jpg,jpeg"
    | ".jpg,.jpeg";
}

const CustomFileUpload: React.FC<CustomUploaderWithSelectBoxProps> = ({
  label,
  value,
  setValue,
  errorText,
  touched,
  bottomLabel = "PNG, JPG or PDF (MAX.3MB).",
  accept = ".png, .jpg, .jpeg, .pdf",
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<any>(null);
  const auth = useAuth();

  const onChange = async (event: any) => {
    const file = event?.target?.files[0];

    console.log(file);
    if (!file) {
      showErrorToast("Invalid file");
      return;
    }

    const size = file.size / (1024 * 1024);

    if (size <= 0) {
      showErrorToast("Please upload valid file");
      return;
    }
    if (size > MAX_SIZE) {
      showErrorToast(
        `File size is more than ${MAX_SIZE}MB,please upload file size less than ${MAX_SIZE} mb`,
      );
      return;
    }

    const type = file.type;
    setSelectedFile(file);
    const formData = new FormData();
    formData.append("file", file);

    try {
      let API_URL: string;
      if (type === "application/pdf") {
        API_URL = `${api.endpoints.upload.document}/${auth.user.id}`;
      } else {
        API_URL = `${api.endpoints.upload.image}/${auth.user.id}`;
      }

      const headers = {
        "Content-Type": "multipart/form-data",
      };

      const { status: apiStatus, data: apiData } = await api.post(
        API_URL,
        formData,
        headers,
      );

      if (apiStatus === 200) {
        const { statusCode, data } = apiData;
        if (statusCode === 200) {
          setValue(data); // Ensure the returned data is the correct file path
        }
      } else {
        showErrorToast("Failed to upload file");
      }
    } catch (error) {
      showErrorToast("An error occurred during the file upload");
    }
  };

  const getUrl = (url: string) => {
    return isValidUrl(url) ? url : `${AWS_BUCKET_URL}/${url}`;
  };

  return (
    <div className="flex flex-col">
      <h4 className="text-sm capitalize text-black mb-[6px]">{label}</h4>
      <div className="border border-dashed border-gray-400 rounded p-4">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          name="file"
          className="hidden"
          onChange={onChange}
        />
        <label
          onClick={() => inputRef?.current?.click()}
          className="cursor-pointer text-blue-500 hover:underline"
        >
          Choose file
        </label>
      </div>
      {selectedFile && (
        <p className="mt-2 text-gray-600">{selectedFile.name}</p>
      )}
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
        {bottomLabel}
      </p>
      {value && (
        <a
          href={getUrl(value)}
          target="_blank"
          className="mt-1 h-[25px] w-[100px] bg-blue-700 content-center items-center text-center rounded text-sm text-white dark:text-white"
          rel="noreferrer"
        >
          View File
        </a>
      )}
      {touched && errorText && String(errorText)?.length > 0 && (
        <span className="text-xs text-red-600">{String(errorText)}</span>
      )}
    </div>
  );
};

export default CustomFileUpload;
