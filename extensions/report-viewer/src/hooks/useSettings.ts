import { useSelector } from "react-redux";
import { RootStateProps } from "@/store/store";

export default function useSettings() {
  return useSelector((state: RootStateProps) => state.settings);
}
