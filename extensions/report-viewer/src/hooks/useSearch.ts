import { useSelector } from "react-redux";
import { RootStateProps } from "@/store/store";
import useDispatchAction from "./useDispatchAction";
import { setSearch } from "@/store/reducers/search.slice";

export default function useSearch() {
  const dispatch = useDispatchAction();
  const { query } = useSelector((state: RootStateProps) => state.search);

  const onSearchInput = (text: string) => {
    dispatch(setSearch(text));
  };
  return {
    query: query,
    onSetSearch: onSearchInput,
  };
}
