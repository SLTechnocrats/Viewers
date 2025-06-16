import { createSlice } from '@reduxjs/toolkit';

import { DateType } from 'react-tailwindcss-datepicker';
import { initialAnalysisValues } from '../../types/ReportAnalysisTypes';

export type FilterTypes = {
  status: number | string;
  search: string;
  modality_id: number;
  test_type_id: number;
  radiologist_id: number;
  priority: string;
  results_type: string;
  branch_id: number;
  report_status: string;
  date: {
    startDate: DateType;
    endDate: DateType;
  };
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
};

type ModalTypes = {
  showViewModal: boolean;
  showRadiologistModal: boolean;
  isPdfViewerOpen: boolean;
  showChangeStatusModal: boolean;
  showMultiModal: boolean;
  showConfirmModal: boolean;
  showChatModal: boolean;
};

const initialModalState: ModalTypes = {
  showViewModal: false,
  showRadiologistModal: false,
  isPdfViewerOpen: false,
  showChangeStatusModal: false,
  showMultiModal: false,
  showConfirmModal: false,
  showChatModal: false,
};

export const initialReportFilters: FilterTypes = {
  status: '',
  search: '',
  modality_id: 0,
  test_type_id: 0,
  radiologist_id: 0,
  priority: '',
  results_type: '',
  branch_id: 0,
  report_status: '',
  date: {
    startDate: null,
    endDate: null,
  },
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
};
const reportSlice = createSlice({
  name: 'report',
  initialState: {
    loading: false,
    modal: initialModalState,
    report: initialAnalysisValues,
    reports: {
      total: 0,
      rows: [],
    },
    multiple_reports: [],
    images: [],
    filters: initialReportFilters,
    notifications: [],
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setReport: (state, action) => {
      Object.assign(state.report, action.payload);
    },
    setReports: (state, action) => {
      Object.assign(state.reports, action.payload);
    },
    setMultipleReports: (state, action) => {
      Object.assign(state.multiple_reports, action.payload);
    },
    setImages: (state, action) => {
      Object.assign(state.images, action.payload);
    },
    setFilterState: (state, action) => {
      Object.assign(state.filters, action.payload);
    },
    setModalState: (state, action) => {
      const { key, value }: { key: keyof ModalTypes; value: any } = action.payload;
      state.modal[key] = value;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
  },
});

export const {
  setLoading,
  setReport,
  setReports,
  setImages,
  setMultipleReports,
  setFilterState,
  setModalState,
  setNotifications,
} = reportSlice.actions;

export default reportSlice.reducer;
