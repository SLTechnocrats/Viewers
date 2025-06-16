import React from "react";
import { useNavigate } from "react-router-dom";

const useTempalteForm = () => {
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [template, setTemplate] = React.useState();

  const navigate = useNavigate();

  const onActionBtnPress = (action: any, params: any) => {
    setTemplate(params);
    if (action === "edit") {
      navigate(`/templates/edit-template/${params.id}`);
    }

    if (action === "delete") {
      setDeleteModal(true);
    }

    console.log(params);
  };

  return { onActionBtnPress, deleteModal, setDeleteModal, template };
};

export default useTempalteForm;
