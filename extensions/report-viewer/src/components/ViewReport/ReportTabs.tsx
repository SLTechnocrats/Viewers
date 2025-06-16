import React, { Fragment, useEffect, useState } from "react";
import { RiRobot2Line } from "react-icons/ri";
import { CgFileDocument } from "react-icons/cg";
import { MdViewSidebar } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import ViewReportTab from "./ViewReportTab";
import ViewAIReportTab from "./ViewAIReportTab";
import { OHIF_SERVER_URL } from "@/api/api";
import classNames from "classnames";
import { ReportAnalysisTypes } from "@/types";
import { getApiToken } from "@/storage/storage";
import { isArray, isNum, isStr } from "@/utils/utils";
import { useNavigate } from "react-router-dom";

const menus = [
  {
    title: "Patient Report",
    icon: <CgFileDocument fontSize={20} />,
    description: "Patient Report",
    route: "patient-report",
  },
  {
    title: "AI Predictive Suggestions",
    icon: <RiRobot2Line fontSize={20} />,
    description: "Ai Predictive Suggestions",
    route: "ai-predictive-suggestions",
  },
  {
    title: "View Study Report",
    icon: <MdViewSidebar fontSize={20} />,
    description: "Report Viewer",
    route: "smart-report-viewer",
  },
];

interface MenuProps {
  title: string;
  icon: any;
  description: string;
  route: string;
}

interface Props {
  analysis: ReportAnalysisTypes;
}

const ReportTabs: React.FC<Props> = ({ analysis }) => {
  const navigate = useNavigate();
  const [routes, setRoutes] = React.useState<MenuProps[]>([]);
  const [menu, setMenu] = useState<MenuProps>({
    title: "",
    icon: <Fragment />,
    description: "",
    route: "",
  });

  const goToMenu = (e: any, item: MenuProps) => {
    e.preventDefault();
    let token = getApiToken();
    if (item.route === "back-button") {
      return navigate(-1);
    }
    if (
      item.route === "smart-report-viewer" &&
      isStr(analysis.patient_study_instance_id) &&
      isNum(analysis.id) &&
      isStr(token)
    ) {
      token = token && encodeURIComponent(token);
      let VIEWER_URL = `${OHIF_SERVER_URL}/viewer?StudyInstanceUIDs=${analysis.patient_study_instance_id}&reportId=${analysis.id}&bearer=${token}`;

      if (analysis.modality === "PET-CT") {
        VIEWER_URL = `${OHIF_SERVER_URL}/tmtv?StudyInstanceUIDs=${analysis.patient_study_instance_id}&reportId=${analysis.id}&bearer=${token}`;
      }
      window.open(VIEWER_URL, "_blank");
      return;
    }
    setMenu(item);
  };

  useEffect(() => {
    const filtered_routes = [];
    for (const item of menus) {
      if (
        (item.route === "ai-predictive-suggestions" &&
          analysis.short_code !== "XR") ||
        (isStr(analysis?.study_deleted_at) &&
          item.route === "smart-report-viewer")
      ) {
        continue;
      }
      filtered_routes.push(item);
    }
    setRoutes(filtered_routes);
  }, [analysis]);

  useEffect(() => {
    if (isArray(routes)) {
      setMenu(routes[0]);
    }
  }, [routes]);

  return (
    <div className="h-full bg-none  rounded-xl md:p-6">
      <div className="w-full h-full">
        <div className="w-full h-8 flex items-center flex-wrap gap-2 md:gap-4 px-1">
          <button
            className="flex flex-row justify-start items-center content-center text-xs gap-1 md:gap-2 w-fit h-full p-2 rounded-lg active bg-red-400"
            onClick={(e) =>
              goToMenu(e, {
                description: "",
                icon: undefined,
                route: "back-button",
                title: "",
              })
            }
          >
            <span className="text-white">
              <IoMdArrowRoundBack fontSize={20} className="md:text-[25px]" />
            </span>
            <span className="text-white text-xs md:text-sm">
              Back To Reports
            </span>
          </button>
          {routes.map((item, index) => {
            const _classes =
              item.route === menu.route
                ? "active bg-[#45197f]"
                : "active bg-blue-700";
            return (
              <button
                className={classNames(
                  "flex flex-row items-center content-center text-xs gap-1 md:gap-2 w-fit h-full p-2 rounded-lg",
                  _classes,
                )}
                onClick={(e) => goToMenu(e, item)}
                key={index}
              >
                <span className="text-white">{item.icon}</span>
                <span className="text-white text-xs md:text-sm">
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className=" md:p-4 text-medium mt-14 lg:mt-0 text-gray-400 bg-white rounded-lg">
        {menu.route === "ai-predictive-suggestions" && (
          <ViewAIReportTab title={menu.title} analysis={analysis} />
        )}
        {menu.route === "patient-report" && (
          <ViewReportTab title={menu.title} analysis={analysis} />
        )}
      </div>
    </div>
  );
};

export default ReportTabs;
