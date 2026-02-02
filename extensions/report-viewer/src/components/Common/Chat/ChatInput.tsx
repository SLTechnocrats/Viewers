import React, { useState, useRef, useEffect } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { FaSmile, FaPaperclip, FaPaperPlane, FaTimes } from "react-icons/fa";
import { showErrorToast } from "@/utils/notify";
import { api } from "@/api/api";
import useAuth from "@/hooks/useAuth";
import classNames from "classnames";
import { getUrl } from "@/utils/utils";

interface ChatInputProps {
  value: string;
  setValue: (value: string) => void;
  handleSubmit?: () => void;
  isLoading: boolean;
  setIsLoading: (arg: boolean) => void;
  filesPaths: string[];
  setFilesPaths: (arg: string[]) => void;
}

const MAX_SIZE = 30; // Max file size in MB

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  setValue,
  handleSubmit,
  isLoading,
  setIsLoading,
  filesPaths,
  setFilesPaths,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const auth = useAuth();

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newValue =
        value.slice(0, start) + emojiData.emoji + value.slice(end);
      setValue(newValue);
      setShowEmojiPicker(false);
      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(
          start + emojiData.emoji.length,
          start + emojiData.emoji.length
        );
      }, 0);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading) {
      return;
    }

    const files = event.target.files;
    if (!files || files.length === 0) {
      showErrorToast("No files selected");
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      const size = file.size / (1024 * 1024);
      if (size <= 0 || size > MAX_SIZE) {
        errors.push(
          `${file.name} is invalid or exceeds the size limit of ${MAX_SIZE}MB.`
        );
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      showErrorToast(errors.join("\n"));
      return;
    }

    try {
      setIsLoading(true);
      const uploadedPaths: string[] = [];

      for (const file of validFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const API_URL =
          file.type === "application/pdf"
            ? `${api.endpoints.upload.document}/${auth.user.id}`
            : `${api.endpoints.upload.image}/${auth.user.id}`;

        const headers = {
          "Content-Type": "multipart/form-data",
        };

        const { status: apiStatus, data: apiData } = await api.post(
          API_URL,
          formData,
          headers
        );

        if (apiStatus === 200 && apiData.statusCode === 200) {
          uploadedPaths.push(apiData.data); // Ensure this is the correct file path
        } else {
          showErrorToast(`Failed to upload ${file.name}`);
        }
      }

      if (uploadedPaths.length > 0) {
        setFilesPaths([...(filesPaths || []), ...uploadedPaths]); // Append new uploads to existing value
      }
    } catch (error) {
      console.log(error);
      showErrorToast("An error occurred during the file upload");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit?.();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div>
      <div className="flex max-h-[50vh] overflow-y-auto bg-gray-200 rounded-md flex-wrap gap-3">
        {filesPaths.length
          ? filesPaths.map((path) => {
            if (path.split(".")[1] === "pdf") {
              return (
                <div key={path} className="relative m-2 rounded-md shadow-sm overflow-hidden ">
                  <iframe
                    src={`${getUrl(path)}#page=1`}
                    className="h-96"
                  ></iframe>
                  <button
                    onClick={() => {
                      setFilesPaths(
                        filesPaths.filter(
                          (filePath: string) => filePath !== path
                        )
                      );
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full text-sm"
                    title="Delete"
                  >
                    <FaTimes />
                  </button>
                </div>
              );
            }

            return (
              <div key={path}>
                <ImgBox
                  img={getUrl(path)}
                  onDelete={() => {
                    setFilesPaths(
                      filesPaths.filter(
                        (filePath: string) => filePath !== path
                      )
                    );
                  }}
                />
              </div>
            );
          })
          : null}
      </div>
      <div className="flex items-center p-2 border border-gray-300 bg-gray-100 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 p-2 border-none rounded-lg bg-white outline-none resize-none overflow-hidden"
          rows={1}
        />
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="ml-2 text-xl text-gray-500 hover:text-gray-700"
        >
          <FaSmile />
        </button>
        <input
          multiple
          type="file"
          id="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
        <label
          htmlFor="file"
          className="ml-2 text-xl text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <FaPaperclip />
        </label>
        <button
          onClick={() => handleSubmit?.()}
          className="ml-2 text-xl text-gray-500 hover:text-gray-700"
        >
          <FaPaperPlane />
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-12 left-0">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInput;

interface ImgBoxProps {
  img: string;
  onDelete: () => void;
}

const ImgBox: React.FC<ImgBoxProps> = ({ img, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative m-2 inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={img} className={classNames("rounded-md w-40 object-cover")} />
      {isHovered && (
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full text-sm"
          title="Delete"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
};
