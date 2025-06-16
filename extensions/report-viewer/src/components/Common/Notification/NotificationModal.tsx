import { api } from "@/api/api";
import useNotification from "@/hooks/useNotification";
import { Drawer } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { RiCloseLargeFill } from "react-icons/ri";
import ChatModal from "../Chat/ChatModal";
import { ReportAnalysisTypes } from "@/types";
import { useSelector } from "react-redux";
import { RootStateProps } from "@/store/store";
import useDispatchAction from "@/hooks/useDispatchAction";
import { setNotifications } from "@/store/reducers/report.slice";
import useSocket from "@/hooks/useSocket";

interface NotificationType {
  id: number;
  title: string;
  message: string;
  misc_id: number;
}

interface NotificationModalProps {
  open: boolean;
  onClose: (arg: "modal") => void;
}

const NotificationModal: FC<NotificationModalProps> = ({ onClose, open }) => {
  const { getPatientReport } = useNotification();
  const { user } = useSelector((state: RootStateProps) => state.auth)
  const socket = useSocket()
  const notifications = useSelector(
    (state: RootStateProps) => state.report.notifications,
  );
  const dispatch = useDispatchAction();

  const [selectedReport, setSelectedReport] =
    useState<ReportAnalysisTypes | null>(null);
  const [chatModalOpen, setChatModalOpen] = useState(false);

  const getNotifications = async () => {
    try {
      // Fetch notifications
      const response = await api.get(`${api.endpoints.notification.get}/${user.id}`);
      const { statusCode, data } = response.data;

      if (statusCode === 200) {
        dispatch(setNotifications(data));
      } else {
        dispatch(setNotifications([]));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const handleNotificationClick = async (misc_id: number) => {
    const report = await getPatientReport(misc_id);
    if (report) {
      setSelectedReport(report[0]);
      setChatModalOpen(true);
      readNotification(report[0]);
      //   onClose("modal");
    }
  };

  const readNotification = async (report: ReportAnalysisTypes) => {
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
    if (socket) {
      socket.connect();
      socket.on("report-chat", () => {
        getNotifications();
      });
      return () => {
        socket.off();
        socket.disconnect();
      };
    }
  }, [socket]);

  return (
    <div>
      {chatModalOpen && selectedReport ? (
        <ChatModal
          report={selectedReport}
          open={chatModalOpen}
          onClose={() => setChatModalOpen(false)}
        />
      ) : (
        <Drawer
          anchor="right"
          open={open}
          onClose={() => onClose("modal")}>
          <div className="w-screen sm:w-96 relative">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h1 className="text-lg font-semibold">Notifications</h1>
              <RiCloseLargeFill
                onClick={() => onClose("modal")}
                className=" cursor-pointer top-5 right-5"
              />
            </div>
            <div className="p-4">
              {notifications.map((notification: NotificationType) => (
                <div key={notification.id}>
                  <NotificationBox
                    title={notification.title}
                    message={notification.message}
                    misc_id={notification.misc_id}
                    onClick={() =>
                      handleNotificationClick(notification.misc_id)
                    }
                  />
                  <hr className="my-4" />
                </div>
              ))}
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};

export default NotificationModal;

interface NotificationBoxProps {
  title: string;
  message: string;
  misc_id: number;
  onClick: () => void;
}

const NotificationBox: FC<NotificationBoxProps> = ({
  title,
  message,
  onClick,
}) => {
  return (
    <div onClick={onClick} className="flex cursor-pointer items-center gap-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      <div>
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="text-gray-500">{message}</p>
      </div>
    </div>
  );
};
