import React, { useMemo, useState } from "react";
import { TinyMceEditor } from "@/lib/TinyMceEditor";
import { formatContent } from "@/utils/utils";

interface Props {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  width?: string | number;
  height?: string | number;
}

const TextEditor: React.FC<Props> = ({
  onChange,
  value,
  width = "100%",
  height = "500px",
}) => {
  const [initialRender, setInitialRender] = useState(true);

  const onChangeEditorValue = (html: string) => {
    html = formatContent(html);
    onChange(encodeURIComponent(html));
  };

  const content = useMemo(() => {
    if (initialRender && value) {
      const html = formatContent(value);
      setInitialRender(false);
      return html;
    }
  }, [value]);

  return (
    <div className="w-full">
      <TinyMceEditor
        initialValue={content}
        onChange={(content) => onChangeEditorValue(content)}
        width={width}
        height={height}
      />
    </div>
  );
};

export default TextEditor;
