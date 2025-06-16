import React, { Fragment, useEffect, useState } from "react";
import ImageSlider from "./ImageSlider";
import { ReportAnalysisTypes } from "@/types";
import { isStr } from "@/utils/utils";
import { api } from "@/api/api";

interface ImageProps {
  output_image: string;
  fracture_flag: string;
}

interface DiagnosisViewInputProps {
  title: string;
  analysis: ReportAnalysisTypes;
}

const ViewAIReportTab: React.FC<DiagnosisViewInputProps> = ({
  title,
  analysis,
}) => {
  const [images, setImages] = useState<ImageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getMlAnalysis = async (params: {
    reportId: number;
    studyId: string;
    patientId: number;
  }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const data = JSON.stringify({
        reportid: params.reportId,
        studyid: params.studyId,
        patientid: params.patientId,
      });
      setIsLoading(true);
      const { status: apiStatus, data: apiData } = await api.post(
        api.endpoints.ml.get,
        data,
        headers,
      );
      if (apiStatus === 200) {
        setIsLoading(false);
        const { statusCode, data } = apiData;
        if (statusCode === 200) {
          setImages(data);
        }
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isStr(analysis?.patient_study_id) && analysis?.short_code === "XR") {
      void (async () => {
        const params = {
          studyId: analysis.patient_study_id,
          patientId: analysis.patient_id,
          reportId: analysis.id,
        };
        await getMlAnalysis(params);
      })();
    }
  }, [analysis]);

  return (
    <Fragment>
      <div className="mb-3">
        <h3 className="text-base md:text-lg font-bold text-black">{title}</h3>
      </div>

      <div className="h-full p-2">
        <div className="p-2 my-2 bg-gray-100 shadow-md rounded-md">
          <h4 className="text-sm md:text-base text-black font-bold">
            Disclaimer:
          </h4>
          <p className="text-xs md:text-sm text-red-800 text-justify font-bold">
            The information and recommendations provided are based on the
            patient’s history and imaging data.
          </p>
          <p className="text-xs md:text-sm text-red-800 text-justify font-bold">
            This consultation is intended for professional advice only and
            should not replace clinical judgment.
          </p>
        </div>
        {isLoading && (
          <div className=" h-full flex bg-[#00000080] justify-center items-center text-center p-4 rounded-md">
            <span className="text-white font-bold text-sm md:text-base">
              ...loading, please wait
            </span>
          </div>
        )}
        <div className="mt-4">
          <ImageSlider images={images} />
        </div>
      </div>
    </Fragment>
  );
};

export default ViewAIReportTab;
