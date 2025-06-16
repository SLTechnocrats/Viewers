import { useState } from "react";
import { DiagnosticCenter } from "@/types";
import { FormikValues } from "formik";
export default function useBranchForm() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStepTwoModal, setShowStepTwoModal] = useState(false);
  const [showStepThreeModal, setShowStepThreeModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showStepTwoEditModal, setShowStepTwoEditModal] = useState(false);
  const [showStepThreeEditModal, setShowStepThreeEditModal] = useState(false);

  const [branch, setBranch] = useState<DiagnosticCenter | FormikValues>({
    branch_name: "",
    branch_address: "",
    contact_no: "",
    email: "",
    timing: "",
    client_id: 0,
    inserted_by: 0,
    tin: "",
    business_licence: "",
    hipaa: false,
    regulatory_details: "",
    no_of_Img_machines: 0,
    types_of_Img_equipments: "",
    hours_of_operation: "",
    dicom_comp_of_Img_equip: "",
    info_on_pacs: "",
    Internet_con_details: "",
    res_time_exp_for_Img_analysis: "",
    avail_urgent_cases: false,
    reporting_formats: "",
    accreditation_info: "",
    radiologists_credentials: "",
    sec_measures_for_data_protection: "",
    access_control_mechanisms_data: "",
    disaster_recovery_plan: "",
    emr_system_used: "",
    com_proto_img_reports: "",
    billing_contact_info: "",
    comments: "",
  });

  const goToStepOne = (params: DiagnosticCenter | FormikValues) => {
    setBranch({
      ...params,
      ...branch,
    });
    setShowCreateModal(true);
    setShowStepTwoModal(false);
  };

  const goToStepTwo = (params: DiagnosticCenter | FormikValues) => {
    setBranch({
      ...branch,
      ...params,
    });
    setShowCreateModal(false);
    setShowStepTwoModal(true);
  };

  const goToStepThree = (params: DiagnosticCenter | FormikValues) => {
    setBranch({
      ...branch,
      ...params,
    });
    setShowStepTwoModal(false);
    setShowStepThreeModal(true);
  };

  const goToEditStepOne = (params: DiagnosticCenter | FormikValues) => {
    setBranch({
      ...params,
      ...branch,
    });
    setShowEditModal(true);
    setShowStepTwoEditModal(false);
  };

  const goToEditStepTwo = (params: DiagnosticCenter | FormikValues) => {
    setBranch({
      ...branch,
      ...params,
    });
    setShowEditModal(false);
    setShowStepTwoEditModal(true);
  };

  const goToEditStepThree = (params: DiagnosticCenter | FormikValues) => {
    setBranch({
      ...branch,
      ...params,
    });
    setShowStepTwoEditModal(false);
    setShowStepThreeEditModal(true);
  };

  return {
    branch,
    setBranch,
    showCreateModal,
    setShowCreateModal,
    showStepTwoModal,
    setShowStepTwoModal,
    showStepThreeModal,
    setShowStepThreeModal,
    goToStepOne,
    goToStepTwo,
    goToStepThree,
    showEditModal,
    setShowEditModal,
    showStepTwoEditModal,
    setShowStepTwoEditModal,
    showStepThreeEditModal,
    setShowStepThreeEditModal,
    goToEditStepOne,
    goToEditStepTwo,
    goToEditStepThree,
  };
}
