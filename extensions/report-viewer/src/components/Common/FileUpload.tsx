import React from "react";
import LabelWithInput from "./LabelWithInput";
import CustomInput from "./CustomInput";

interface FileUploadProps {
  label: string;
  value?: string;
  onChange?: (arg: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, onChange, value }) => {
  return (
    <div>
      <LabelWithInput
        label={label}
        onChange={onChange}
        value={String(value)}
        touched={false}
      />
      <div className="mt-7">
        <CustomInput type="text" value="" />
      </div>
    </div>
  );
};

export default FileUpload;
