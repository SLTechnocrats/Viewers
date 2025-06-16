const UrgencyLevelButton = ({ priority }: { priority: string }) => {
  let title: string;
  let style: NonNullable<unknown>;
  switch (priority) {
    case "Emergency":
      title = "Emergency";
      style = {
        color: "#FFFFFF",
        backgroundColor: "#ff0000",
      };
      break;
    case "Normal":
      title = "Normal";
      style = {
        color: "#FFFFFF",
        backgroundColor: "#006400",
      };
      break;
    default:
      title = "Not Started";
      style = {
        color: "#FFFFFF",
        backgroundColor: "#6b7280",
      };
      break;
  }
  return (
    <div
      className="flex justify-center items-center w-[100px] h-[25px] rounded"
      style={style}
    >
      <p className="capitalize text-xs font-semibold">{title}</p>
    </div>
  );
};

const StatusButton = ({ label }: { label: string }) => {
  let title: string;
  let style: NonNullable<unknown>;
  switch (label) {
    case "Completed":
      title = "Completed";
      style = {
        color: "#FFFFFF",
        backgroundColor: "#1d7413",
      };
      break;
    case "Pending":
      title = "Pending";
      style = {
        color: "#FFFFFF",
        backgroundColor: "#fb112c",
      };
      break;
    case "Inprocess":
      title = "In Progress";
      style = {
        color: "#FFFFFF",
        backgroundColor: "#039487",
      };
      break;
    default:
      title = "Not Started";
      style = {
        color: "#FFFFFF",
        backgroundColor: "#6b7280",
      };
      break;
  }
  return (
    <div
      className="flex px-2 justify-center items-center w-fit h-[25px] rounded"
      style={style}
    >
      <p className="capitalize text-xs min-w-max font-semibold">{title}</p>
    </div>
  );
};

const ResultTypeButton = ({ label }: { label: string }) => {
  let title: string;
  let style: NonNullable<unknown>;
  switch (label) {
    case "Normal":
      title = "Normal";
      style = {
        color: "#FFFFFF",
        backgroundColor: "#006b69",
      };
      break;
    case "Abnormal":
      title = "Abnormal";
      style = {
        color: "#FFFFFF",
        backgroundColor: "#e60000",
      };
      break;
    case "Clear":
      title = "Clear";
      style = {
        color: "#FFFFFF",
        backgroundColor: "#0040FA",
      };
      break;
    default:
      title = "Not Started";
      style = {
        color: "#FFFFFF",
        backgroundColor: "#6b7280",
      };
      break;
  }
  return (
    <div
      className="flex px-2 justify-center items-center w-[100px] h-[25px] rounded"
      style={style}
    >
      <p className="capitalize text-xs font-semibold">{title}</p>
    </div>
  );
};

export { StatusButton, ResultTypeButton, UrgencyLevelButton };
