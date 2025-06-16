import { useSelector } from "react-redux";
import { RootStateProps } from "@/store/store";

export default function useDrafts() {
  return useSelector((state: RootStateProps) => state.drafts);
}
