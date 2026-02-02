import { Drawer } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
import { RiCloseLargeFill } from "react-icons/ri";
import ChatInput from "./ChatInput";
import { ReportAnalysisTypes } from "@/types";
import classNames from "classnames";
import { api } from "@/api/api";
import { isArray } from "lodash";
import useNotification from "@/hooks/useNotification";
import useSocket from "@/hooks/useSocket";
import { getUrl } from "@/utils/utils";
import { IoMdOpen } from "react-icons/io";
import { AiOutlineFilePdf } from "react-icons/ai";
import logo from "@/assets/images/logo.png"


interface ChatModalProps {
  open: boolean;
  onClose: (arg: "chat-box") => void;
  report: ReportAnalysisTypes;

}

interface Message {
  sender_type: "admin" | "radiologist" | "branch";
  message: string;
  report_id: number;
  media: any[];
  inserted_time: Date;
  branch_id: number;
  radiologist_id: number;
}

const ChatModal: React.FC<ChatModalProps> = ({ open, onClose, report }) => {
  const [value, setValue] = useState("")
  const socket = useSocket()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filesPaths, setFilesPaths] = useState<string[]>([])

  const { getNotifications, notifications } = useNotification()

  const ref = useRef<HTMLDivElement>(null)

  const fetchChats = async () => {
    try {
      const response = await api.get(`${api.endpoints.report_chat.chat}/${report.id}`, {})
      const { statusCode, data } = response.data

      if (statusCode === 200) {
        setMessages(data)
        setTimeout(() => {
          if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
          }
        }, 0);

      }
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async () => {
    const payload = {
      sender_type: "radiologist",
      message: value,
      report_id: report.id,
      media: filesPaths.length ? [...filesPaths] : [],
      inserted_time: new Date(),
      branch_id: report.branch_id,
      radiologist_id: report.radiologist_id,
      patient_name: report.patient_name
    }

    if (!value && !filesPaths.length) {
      return
    }

    try {
      const response = await api.post(api.endpoints.report_chat.chat, payload)
      const { statusCode } = response.data
      if (statusCode === 200) {
        setValue("")
        setFilesPaths([])
        await fetchChats()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const readNotification = async () => {
    try {
      const response = await api.post(api.endpoints.notification.read, {
        report_id: report.id,
      });
      const { statusCode } = response.data;
      if (statusCode === 200) {
        console.log("Notification read");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (report.id) {
      fetchChats()
      readNotification()
    }
    return () => {
      readNotification()
      getNotifications(notifications)
    }
  }, [report.id])

  useEffect(() => {
    if (socket) {
      socket.connect()
      socket.on("report-chat", (_report) => {
        if (_report.report_id === report.id) {
          void fetchChats()
        }
      })

      return () => {
        socket.off()
        socket.disconnect()
      }
    }
  }, [socket, report])

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        if (ref.current) {
          ref.current.scrollTop = ref.current.scrollHeight;
        }
      }, 100); // Small delay to ensure DOM updates
    }
  }, [messages]); // Depend on messages, so it triggers after every update



  return (
    <div>
      <Drawer anchor="right" open={open} onClose={() => onClose("chat-box")}>
        <div className="w-screen sm:w-[30rem] h-20 !bg-[#45197f] text-white relative">
          <RiCloseLargeFill onClick={() => onClose("chat-box")} className="absolute cursor-pointer top-5 right-5" />
          <h1
            className="mx-auto w-full max-w-[50%] text-center font-semibold mt-5 !capitalize overflow-hidden text-ellipsis whitespace-nowrap"
            title={report.patient_name}
          >
            {report.patient_name}
          </h1>
          <img className="w-20 absolute top-5 left-5 rounded-md" src={logo} />
        </div>
        <div className="flex w-screen sm:w-[30rem] flex-col h-full justify-between overflow-hidden">

          <div ref={ref} className="flex flex-col  h-full my-4 mx-2 pr-2 overflow-y-auto gap-10">


            {isArray(messages) &&
              messages.map((message, index) => {
                return (
                  <div key={index}>
                    {
                      message.media.length ? message.media.map((_media) => {
                        if (_media.split(".")[1] === "pdf") {
                          return (
                            <PdfBox type={message.sender_type === "radiologist" ? "sent" : "received"} url={getUrl(_media)} key={_media} />
                          );
                        }
                        return (
                          <div key={_media}>
                            <ImgBox type={message.sender_type === "radiologist" ? "sent" : "received"} img={getUrl(_media)} />
                          </div>
                        )
                      }) : null
                    }
                    {
                      message.message.length ? <ChatBox
                        report={report}
                        time={message.inserted_time}
                        message={message.message}
                        type={
                          message.sender_type === "radiologist" ? "sent" : "received"
                        }
                        senderType={message.sender_type}
                      /> : null
                    }
                  </div>
                );
              })}

          </div>
          <div className="w-full">
            <ChatInput
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              filesPaths={filesPaths}
              handleSubmit={handleSubmit}
              setFilesPaths={setFilesPaths}
              value={value}
              setValue={value => setValue(value)}
            />
          </div>
        </div>
      </Drawer>
    </div>
  )
}

export default ChatModal
interface PdfBoxProps {
  url: string;
}

const PdfBox: React.FC<PdfBoxProps & { type: "sent" | "received" }> = ({ url, type }) => {
  return (
    <div className={classNames("max-w-[50%] my-4 flex ", type === "sent"
      ? "ml-auto justify-end "
      : "mr-auto justify-start",)}>
      <div className="relative group">
        <iframe
          src={url}
          className="w-40 h-40 object-cover"
          title="PDF"
          style={{ pointerEvents: "none" }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-white mx-2">
            <AiOutlineFilePdf size={24} />
          </a>
        </div>
      </div>
    </div>
  );
};


interface ImgBoxProps {
  img: string;
  type: "sent" | "received"
}

const ImgBox: React.FC<ImgBoxProps> = ({ img, type }) => {
  return (
    <div className={classNames("flex my-4 w-full", type === "sent" ? "justify-end" : "justify-start")}>
      <div className={classNames("relative w-40 group max-w-[50%]",)}>
        <img src={img} className={classNames("rounded-md w-40 object-cover", " flex justify-end", type === "sent"
          ? "ml-auto "
          : "mr-auto")} />
        <div className={classNames("absolute inset-0 flex items-center rounded-md  w-40 justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity", type === "sent" ? "right-0" : "right-0")}>
          <a href={img} target="_blank" rel="noopener noreferrer" className="text-white mx-2">
            <IoMdOpen size={24} />
          </a>
        </div>
      </div>
    </div>
  )
}


interface ChatBoxProps {
  message: string;
  type: "sent" | "received";
  time: Date;
  senderType: "admin" | "radiologist" | "branch";
  report: ReportAnalysisTypes;
}

const ChatBox: React.FC<ChatBoxProps> = ({ message, type, time, senderType, report }) => {
  const formattedTime = new Date(time).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const fullFormattedTime = new Date(time).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <div className={classNames("max-w-[70%] w-fit bg-gray-500 text-white font-semibold ", type === "sent" ? "ml-auto rounded-l-lg rounded-r-sm" : "mr-auto rounded-l-sm rounded-r-lg",
        senderType === "admin" && "!bg-[#45197f]",
        senderType === "radiologist" && "!bg-[#347928]",
        senderType === "branch" && "!bg-[#674636] "

      )}>
        <p className="p-2">{message}</p>
        {type === "received" && <p className="text-xs text-white p-2">{senderType === "admin" ? "SmaRo" : report.branch_name}</p>}
      </div>
      <div
        className={classNames(
          "text-xs flex  text-gray-700 max-w-[50%] w-full p-2",
          type === "sent" ? "ml-auto justify-end" : "mr-auto",
        )}
        title={fullFormattedTime}>
        <p>{formattedTime}</p>
      </div>
    </>

  )
}