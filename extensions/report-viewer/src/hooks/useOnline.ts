import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { isNum } from "@/utils/utils";
import { api } from "@/api/api";
import { showErrorToast, showSuccessToast } from "@/utils/notify";
import { setIsOnline } from "@/store/reducers/auth.slice";
import useDispatchAction from "@/hooks/useDispatchAction";

export default function useOnline() {
  const { user, isOnline } = useAuth();
  const dispatch = useDispatchAction();

  const checkIsOnline = async (id: number) => {
    try {
      const { status: apiStatus, data: apiData } = await api.get(
        api.endpoints.auth.online_status + "/" + id,
        {},
      );
      if (apiStatus === 200) {
        const { statusCode, data } = apiData;
        if (statusCode === 200 && isNum(data?.id)) {
          dispatch(setIsOnline(true));
        } else {
          dispatch(setIsOnline(false));
        }
      }
    } catch (e) {
      dispatch(setIsOnline(false));
    }
  };

  const changeOnlineStatus = async () => {
    try {
      if (!isNum(user?.id)) {
        return showErrorToast("Invalid Radiologist");
      }
      const headers = {
        "Content-Type": "application/json",
      };

      const params = JSON.stringify({
        action: isOnline ? "end-shift" : "start-shift",
        radiologist_id: user?.id,
      });

      const { status: apiStatus, data: apiData } = await api.post(
        api.endpoints.auth.change_online_status,
        params,
        headers,
      );
      if (apiStatus === 200) {
        const { statusCode, data, message, error } = apiData;
        if (statusCode === 200 && data.status === "started") {
          dispatch(setIsOnline(true));
          showSuccessToast(message);
        } else if (statusCode === 200 && data.status === "ended") {
          dispatch(setIsOnline(false));
          showSuccessToast(message);
        } else {
          showErrorToast(error);
        }
      }
    } catch (e) {
      dispatch(setIsOnline(false));
    }
  };

  useEffect(() => {
    if (isNum(user?.id)) {
      void (async () => {
        await checkIsOnline(user.id);
      })();
    }
  }, [user]);

  return {
    name: user?.name,
    isOnline,
    changeOnlineStatus,
  };
}
