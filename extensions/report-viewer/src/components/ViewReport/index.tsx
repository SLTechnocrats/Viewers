import React, { useEffect, useState } from 'react';
import ViewReportTab from './ViewReportTab';
import * as _ from 'lodash';
import { showErrorToast } from '../../utils/notify';
import { initialAnalysisValues, ReportAnalysisTypes } from '../../types/ReportAnalysisTypes';
import { api } from '../../api/api';
import { isArray } from 'lodash';
import useParams from '../../hooks/useParams';
import axios from 'axios';

const ViewReport: React.FC = () => {
  const report_id = useParams('reportId');
  const token = useParams('bearer');
  const [analysis, setAnalysis] = useState<ReportAnalysisTypes>(initialAnalysisValues);

  const getPatientReport = async (_id: number | string, token: string) => {
    if (!token) {
      return;
    }
    if (!_id) {
      return;
    }
    const config = {
      headers: {
        Token: token,
      },
    };
    if (!_.isNumber(_id)) {
      showErrorToast('Invalid Report Id');
      return;
    }
    try {
      const { status: apiStatus, data: apiData } = await axios.get(
        `${api.endpoints.report.get}/${_id}`,
        config
      );

      if (apiStatus === 200) {
        const { statusCode, data } = apiData;
        if (statusCode === 200) {
          if (isArray(data)) {
            setAnalysis(data[0]);
          } else {
            showErrorToast('Unable to fetch patient report');
          }
        } else {
          showErrorToast('Unable to fetch patient report');
        }
      }
    } catch (e) {
      showErrorToast('Unable to fetch patient report');
    }
  };

  useEffect(() => {
    void (async () => {
      if (report_id && token) {
        console.log(report_id, 'report_id', token, 'token');
        await getPatientReport(Number(report_id), String(token));
      }
    })();
  }, [report_id, token]);

  return (
    <div className="p-2">
      <ViewReportTab analysis={analysis} />
    </div>
  );
};

export default ViewReport;
