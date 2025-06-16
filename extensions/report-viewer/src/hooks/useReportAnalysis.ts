import { ReportAnalysisTypes } from "@/types";
import { useState } from "react";
import { api, OHIF_SERVER_URL } from "@/api/api";
import { notify } from "@/utils/notify";
import { isNum, isStr } from "@/utils/utils";
import { useNavigate } from "react-router-dom";
import { initialAnalysisValues } from "@/types/ReportAnalysisTypes";
import { getApiToken } from "@/storage/storage";

export default function useReportAnalysis() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showMultiModal, setShowMultiModal] = useState(false);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [reports, setReports] = useState<ReportAnalysisTypes[]>([]);
  const [report, setReport] = useState<ReportAnalysisTypes>(
    initialAnalysisValues,
  );
  const handeClosePdfViewer = () => {
    setIsPdfViewerOpen(false);
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
            notify("Empty PDF");
            return;
          }
          setReport(data.analysis);
          setIsPdfViewerOpen(true);
        } else {
          notify(error);
        }
      } else {
        notify("Error loading pdf");
      }
    } catch (e) {
      notify("Something went wrong, please try again later");
    }
  };

  const handleOpenPdfReportViewerClick = async (row: ReportAnalysisTypes) => {
    if (!isNum(row.report_analysis_id)) {
      notify("Invalid Id");
      return;
    }
    await getPatientReportAnalysisPDF(row.report_analysis_id);
  };

  const handleOpenViewerClick = (row: ReportAnalysisTypes) => {
    navigate("/patient-report-view/" + row.id);
  };

  const getAnalysisByRadiologistId = async (id: number) => {
    try {
      if (!isNum(id)) {
        return;
      }
      setIsLoading(true);
      const API_URL = `${api.endpoints.report_analysis.get.radiologist}/${id}`;
      const { status: apiStatus, data: apiData } = await api.get(API_URL, {});
      if (apiStatus === 200) {
        setIsLoading(false);
        const { statusCode, data } = apiData;
        if (statusCode === 200) {
          setReports(data);
        }
      } else {
        setIsLoading(false);
      }
    } catch {
      setIsLoading(false);
    }
  };

  const onPressActionButton = (
    action:
      | "view"
      | "report-viewer"
      | "pdf-viewer"
      | "show-multi-modal"
      | "view-ohif-viewer"
      | "view-xray-viewer",
      
    item: ReportAnalysisTypes,
  ) => {
    setReport(item);
    if (action === "view") {
      setShowViewModal(true);
    }
    if (action === "show-multi-modal") {
      setShowMultiModal(true);
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
    if(action === "view-xray-viewer"){
      
      navigate("/canvas/" + item.id)
        return;
    }
  
  };

  const onClose = (
    action: "view" | "report-viewer" | "pdf-viewer" | "show-multi-modal",
  ) => {
    setReport(initialAnalysisValues);
    if (action === "view") {
      setShowViewModal(false);
    }
    if (action === "pdf-viewer") {
      handeClosePdfViewer();
    }
    if (action === "show-multi-modal") {
      setShowMultiModal(false);
    }
  };

  return {
    report,
    reports,
    onClose,
    isLoading,
    showViewModal,
    showMultiModal,
    isPdfViewerOpen,
    onPressActionButton,
    getAnalysisByRadiologistId,
  };
}
