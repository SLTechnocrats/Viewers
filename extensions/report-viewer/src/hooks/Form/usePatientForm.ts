import { PatientTypes } from "@/types";
import { useState } from "react";

export default function usePatientForm() {
  const initialValues: PatientTypes = {
    id: 0,
    patient_name: "",
    patient_mobile: "",
    patient_email: "",
    age: 0,
    dob: null,
    gender: "",
    address: "",
    estatus: 0,
    inserted_time: null,
    clinical_history_count: 0,
  };
  const [patient, setPatient] = useState<PatientTypes>(initialValues);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const onActionBtnPress = (action: string, item?: PatientTypes) => {
    if (item !== undefined && item !== null) {
      setPatient(item);
    }
    if (action === "add") {
      setShowCreateModal(true);
    }
    if (action === "edit") {
      setShowEditModal(true);
    }

    if (action === "delete") {
      setShowDeleteModal(true);
    }
    if (action === "view") {
      setShowViewModal(true);
    }
    if (action === "show-report") {
      setShowReportModal(true);
    }
  };

  const onClose = (
    action: "create" | "edit" | "view" | "delete" | "show-report",
  ) => {
    setPatient(initialValues);
    if (action === "create") {
      setShowCreateModal(false);
    }
    if (action === "edit") {
      setShowEditModal(false);
    }

    if (action === "delete") {
      setShowDeleteModal(false);
    }
    if (action === "view") {
      setShowViewModal(false);
    }
    if (action === "show-report") {
      setShowReportModal(false);
    }
  };

  return {
    initialValues,
    patient,
    setPatient,
    showCreateModal,
    setShowCreateModal,
    showEditModal,
    setShowEditModal,
    showDeleteModal,
    setShowDeleteModal,
    showViewModal,
    setShowViewModal,
    onActionBtnPress,
    onClose,
    showReportModal,
    setShowReportModal,
  };
}
