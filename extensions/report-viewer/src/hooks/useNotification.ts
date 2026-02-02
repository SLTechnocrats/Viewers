import { api } from "@/api/api";
import { ReportAnalysisTypes } from "@/types";
import {  useState } from "react";
import useDispatchAction from "./useDispatchAction";
import { setNotifications } from "@/store/reducers/report.slice";
import { useSelector } from "react-redux";
import { RootStateProps } from "@/store/store";
import useAuth from "./useAuth";
import _ from "lodash";

const useNotification = () => {
  const [notificationModal, setNotificationModal] = useState(false);
  const [report, setReport] = useState<ReportAnalysisTypes>();
  const dispatch = useDispatchAction();
  const { user } = useAuth();
  const { notifications } = useSelector(
    (state: RootStateProps) => state.report
  );
  const getNotifications = async (_notifications: any) => {
    try {
      // Fetch notifications
      const response = await api.get(
        `${api.endpoints.notification.get}/${user.id}`
      );
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

  const openNotificationModal = () => {
    setNotificationModal(true);
  };

  const onClose = (arg: "modal") => {
    if (arg === "modal") {
      setNotificationModal(false);
    }
  };

  const getPatientReport = async (id: number) => {
    try {
      const response = await api.get(`${api.endpoints.report.get}/${id}`);
      const { statusCode, data } = response.data;
      if (statusCode === 200) {
        setReport(data);
        return data;
      }
    } catch (error) {
      console.log(error);
      return {};
    }
  };

  return {
    notificationModal,
    onClose,
    openNotificationModal,
    report,
    getPatientReport,
    notifications,
    getNotifications,
  };
};

export default useNotification;
