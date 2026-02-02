import React, { useState } from "react";
import { api } from "@/api/api";
import { showErrorToast } from "@/utils/notify";
import { FaFileDownload, FaSpinner } from "react-icons/fa";
import { ReportAnalysisTypes } from "@/types";
import { saveAs } from "file-saver";
import axios from "axios";

interface Props {
  item: ReportAnalysisTypes;
}

const DocxSaveButton: React.FC<Props> = ({ item }) => {
  const [loading, setLoading] = useState(false);

  const fetchHtml = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${api.endpoints.getDocument.docx}?reportId=${item.patient_report_id}&analysisId=${item.report_analysis_id}&radiologistId=${item.radiologist_id}`,
        { responseType: "arraybuffer" },
      );

      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      saveAs(blob, `${item.patient_name}_${item.modality}_report.docx`);
    } catch (error) {
      console.error("Error fetching HTML:", error);
      showErrorToast("Something went wrong while fetching the report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={fetchHtml}
        className={`bg-green-500 text-white rounded-md flex items-center px-1.5 justify-center transition-all duration-200 ${
          loading ? "cursor-not-allowed" : "hover:bg-green-600"
        }w-6 h-6`}
        data-tooltip-id="save-docx-tooltip"
        data-tooltip-content="Save as DOC"
        disabled={loading}
      >
        {loading ? (
          <FaSpinner className="animate-spin text-white w-3 h-3" />
        ) : (
          <FaFileDownload size={13} />
        )}
      </button>
    </div>
  );
};

export default DocxSaveButton;
