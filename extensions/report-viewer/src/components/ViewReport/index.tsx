import React, { useEffect, useState } from 'react';
import ViewReportTab from './ViewReportTab';
import * as _ from 'lodash';
import { showErrorToast } from '../../utils/notify';
import { initialAnalysisValues, ReportAnalysisTypes } from '../../types/ReportAnalysisTypes';
import { api } from '../../api/api';
import { isArray } from 'lodash';
import useParams from '../../hooks/useParams';
import { setApiToken } from '../../storage/storage';
import useDispatchAction from '../../hooks/useDispatchAction';
import { setAuth } from '../../store/reducers/auth.slice';

const ViewReport: React.FC = () => {
  const { reportId: report_id, bearer: token } = useParams();
  const [analysis, setAnalysis] = useState<ReportAnalysisTypes>(initialAnalysisValues);
  const dispatch = useDispatchAction();

  const getPatientReport = async (_id: number | string, token: string) => {
    if (!token) {
      return;
    }
    if (!_id) {
      return;
    }

    if (!_.isNumber(_id)) {
      showErrorToast('Invalid Report Id');
      return;
    }
    try {
      const { status: apiStatus, data: apiData } = await api.get(
        `${api.endpoints.report.get}/${_id}`
      );

      console.log(apiData, 'apiData', apiStatus, token, _id, 'apiStatus');

      if (apiStatus === 200) {
        const { statusCode, data } = apiData;
        if (statusCode === 200) {
          if (isArray(data)) {
            setAnalysis(data[0]);
          } else {
            // showErrorToast('Unable to fetch patient report');
          }
        } else {
          // showErrorToast('Unable to fetch patient report');
        }
      }
    } catch (e) {
      // showErrorToast('Unable to fetch patient report');
    }
  };

  useEffect(() => {
    void (async () => {
      if (report_id && token) {
        setApiToken(token);
        dispatch(setAuth({ token: token }));
        await getPatientReport(Number(report_id), String(token));
      }
    })();
  }, [dispatch, report_id, token]);

  return (
    <div className="h-full overscroll-y-auto ">
      <ViewReportTab analysis={analysis} />
    </div>
  );
};

export default ViewReport;
