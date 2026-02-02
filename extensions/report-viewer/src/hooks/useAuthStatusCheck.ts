import { useCallback, useEffect } from "react";
import { api } from "@/api/api";
import useAuth from "./useAuth";
import useDispatchAction from "./useDispatchAction";
import { logOut } from "@/store/reducers/auth.slice";

const useAuthStatusCheck = () => {
  const { token } = useAuth();
  const dispatch = useDispatchAction();

  const poll = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      const { status: apiStatus, data: apiData } = await api.get(
        api.endpoints.authCheck,
        {},
      );
      if (apiStatus === 200) {
        const { error } = apiData;
        if (error === "unauthenticated") {
          dispatch(logOut());
        }
      }

      // Handle the response if needed
    } catch (error: any) {
      if (
        error.response &&
        error.response.status === 404 &&
        error.response.data.error === "unauthenticated"
      ) {
        dispatch(logOut());
      }
    }
  }, [token, dispatch]);

  useEffect(() => {
    void (async () => {
      await poll();
    })();
    const interval = setInterval(poll, 30000);
    return () => clearInterval(interval);
  }, [poll]);
};

export default useAuthStatusCheck;
