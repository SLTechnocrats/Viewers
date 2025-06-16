import { ReportAnalysisTypes } from "@/types";
import { api, OHIF_SERVER_URL } from "@/api/api";
import { showErrorToast } from "@/utils/notify";
import { isNum, isStr } from "@/utils/utils";
import { useNavigate } from "react-router-dom";
import { initialAnalysisValues } from "@/types/ReportAnalysisTypes";
import { getApiToken } from "@/storage/storage";
import { useSelector } from "react-redux";
import { RootStateProps } from "@/store/store";
import {
  setReports,
  setLoading,
  setModalState,
  setReport,
  setFilterState,
  FilterTypes,
  setMultipleReports,
} from "@/store/reducers/report.slice";
import useDispatchAction from "@/hooks/useDispatchAction";
import useAuth from "@/hooks/useAuth";

export default function useReport() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatchAction();
  const { loading, modal, report, filters, reports, multiple_reports } =
    useSelector((state: RootStateProps) => state.report);

  const handeClosePdfViewer = () => {
    dispatch(setModalState({ key: "isPdfViewerOpen", value: false }));
  };

  const getPatientReportAnalysisPDF = async (id: number) => {
    try {
      const { status: apiStatus, data: apiData } = await api.get(
        api.endpoints.report_analysis.reportPDF + "/" + id,
        {},
      );

      if (apiStatus === 200) {
        const { statusCode, error, data } = apiData;
        if (statusCode === 200) {
          if (data === undefined || data === null) {
            showErrorToast("Empty PDF");
            return;
          }
          dispatch(setReport(data.analysis));
          dispatch(setModalState({ key: "isPdfViewerOpen", value: true }));
        } else {
          showErrorToast(error);
        }
      } else {
        showErrorToast("Error loading pdf");
      }
    } catch (e) {
      showErrorToast("Something went wrong, please try again later");
    }
  };

  const handleOpenPdfReportViewerClick = async (row: ReportAnalysisTypes) => {
    if (!isNum(row.report_analysis_id)) {
      showErrorToast("Invalid Id");
      return;
    }
    await getPatientReportAnalysisPDF(row.report_analysis_id);
  };

  const handleOpenViewerClick = (row: ReportAnalysisTypes) => {
    navigate("/patient-report-view/" + row.id);
  };

  const fetchReports = async (
    params: FilterTypes | null,
    isRefresh: boolean,
  ) => {
    try {
      if (!isNum(user?.id)) {
        return;
      }
      if (isRefresh) {
        dispatch(setLoading(true));
      }
      const API_URL = `${api.endpoints.report_analysis.get.radiologist}/${user.id}`;

      const headers = {
        "Content-Type": "application/json",
      };

      const formData = JSON.stringify({
        ...params,
        search: filters.search?.length > 3 ? filters.search : "",
      });

      const { status: apiStatus, data: apiData } = await api.post(
        API_URL,
        formData,
        headers,
      );
      if (apiStatus === 200) {
        const { statusCode, data } = apiData;
        if (statusCode === 200) {
          dispatch(setReports(data));
          if (isRefresh) {
            dispatch(setLoading(false));
          }
        } else {
          const result = {
            rows: [],
            total: 0,
          };
          dispatch(setReports(result));
          if (isRefresh) {
            dispatch(setLoading(false));
          }
        }
      } else {
        const result = {
          rows: [],
          total: 0,
        };
        dispatch(setReports(result));
        if (isRefresh) {
          dispatch(setLoading(false));
        }
      }
    } catch {
      const result = {
        rows: [],
        total: 0,
      };
      dispatch(setReports(result));
      if (isRefresh) {
        dispatch(setLoading(false));
      }
    }
  };

  const fetchMultipleReports = async (report_id: number) => {
    if (!isNum(report_id)) {
      showErrorToast("Invalid Report Id");
      return;
    }
    try {
      const { status: apiStatus, data: apiData } = await api.get(
        api.endpoints.report.get_multiple_reports + "/" + report_id,
        {},
      );
      if (apiStatus === 200) {
        const { statusCode, data } = apiData;
        if (statusCode === 200) {
          dispatch(setMultipleReports(data));
        } else {
          dispatch(setMultipleReports([]));
        }
      }
    } catch (e) {
      dispatch(setMultipleReports([]));
    }
  };

  const onPressActionButton = (
    action:
      | "view"
      | "report-viewer"
      | "pdf-viewer"
      | "show-multi-modal"
      | "view-ohif-viewer"
      | "view-xray-viewer"
      | "chat-box",

    item: ReportAnalysisTypes,
  ) => {
    dispatch(setReport(item));
    if (action === "view") {
      dispatch(setModalState({ key: "showViewModal", value: true }));
    }
    if (action === "show-multi-modal") {
      dispatch(setModalState({ key: "showMultiModal", value: true }));
    }

    if(action === "chat-box"){
      dispatch(setModalState({key: "showChatModal", value: true}));
    }

    if (action === "report-viewer") {
      handleOpenViewerClick(item);
    }
    if (action === "pdf-viewer") {
      handleOpenPdfReportViewerClick(item).catch((err) => console.error(err));
    }
    if (action === "view-ohif-viewer") {
      let token = getApiToken();
      if (isNum(item.id) && isStr(token)) {
        token = token && encodeURIComponent(token);
        let VIEWER_URL = `${OHIF_SERVER_URL}/viewer?StudyInstanceUIDs=${item.patient_study_instance_id}&reportId=${item.id}&bearer=${token}`;
        if (item.modality === "PET-CT") {
          VIEWER_URL = `${OHIF_SERVER_URL}/tmtv?StudyInstanceUIDs=${item.patient_study_instance_id}&reportId=${item.id}&bearer=${token}`;
        }
        window.open(VIEWER_URL, "_blank");
        return;
      }
    }
    if (action === "view-xray-viewer") {
      navigate("/canvas/" + item.id);
      return;
    }
  };

  const onClose = (
    action: "view" | "report-viewer" | "pdf-viewer" | "show-multi-modal" | "chat-box",
  ) => {
    dispatch(setReport(initialAnalysisValues));
    if (action === "view") {
      dispatch(setModalState({ key: "showViewModal", value: false }));
    }
    if (action === "pdf-viewer") {
      handeClosePdfViewer();
    }
    if (action === "show-multi-modal") {
      dispatch(setModalState({ key: "showMultiModal", value: false }));
    }
    if(action === "chat-box"){
      dispatch(setModalState({key: "showChatModal", value: false}));
    }
  };

  return {
    modal,
    report,
    filters,
    loading,
    reports,
    onClose,
    fetchReports,
    setFilterState,
    multiple_reports,
    onPressActionButton,
    fetchMultipleReports,
  };
}
