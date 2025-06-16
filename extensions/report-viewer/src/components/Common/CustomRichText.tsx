import React from "react";
import TextEditor from "./TextEditor";

interface CustomRichTextProps {
  value: string;
  dataMember: string;
  onChange: any;
  placeholder: string;
  className?: string;
}

const CustomRichText: React.FC<CustomRichTextProps> = ({
  onChange,
  value = "",
  dataMember,
  placeholder = "Write Note",
}) => {
  const onChangeText = (content: string) => {
    onChange(dataMember, { target: { value: content } }); // Notify parent component
  };

  return (
    <div className="relative">
      {" "}
      {/* Added relative positioning for the container */}
      <TextEditor
        placeholder={placeholder}
        value={value}
        onChange={onChangeText}
      />
    </div>
  );
};

export default CustomRichText;
