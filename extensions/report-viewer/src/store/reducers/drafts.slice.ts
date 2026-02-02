import { createSlice } from '@reduxjs/toolkit';
import * as _ from 'lodash';
import { ReportAnalysisTypes } from '../../types/ReportAnalysisTypes';
import { showSuccessToast } from '../../utils/notify';

interface InitialStateTypes {
  drafts: ReportAnalysisTypes[];
}

const initialState: InitialStateTypes = {
  drafts: [],
};

const draftsSlice = createSlice({
  name: 'drafts',
  initialState: initialState,
  reducers: {
    setReportInDraft: (state, action) => {
      const draft = action.payload;
      // Check if the report already exists
      const rIndex = state.drafts.findIndex(r => r.id === draft.id);

      if (rIndex !== -1) {
        // Update the existing report immutably
        state.drafts = state.drafts.map((r, index) => (index === rIndex ? draft : r));
      } else {
        // Add a new report immutably
        if (_.isNumber(draft.id)) {
          state.drafts = [...state.drafts, draft];
        }
      }
      showSuccessToast('Successfully saved in draft');
    },
    mountingDraft: (state, action) => {
      const draft = action.payload;
      // Check if the report already exists
      const rIndex = state.drafts.findIndex(r => r.id === draft.id);

      if (rIndex !== -1) {
        // Update the existing report immutably
        state.drafts = state.drafts.map((r, index) => (index === rIndex ? draft : r));
      } else {
        // Add a new report immutably
        if (_.isNumber(draft.id)) {
          state.drafts = [...state.drafts, draft];
        }
      }
    },
    removeReportFromDraft: (state, action) => {
      const id = action.payload;
      const rIndex = state.drafts.findIndex(r => r.id === id);
      if (rIndex !== -1) {
        state.drafts = state.drafts.filter(r => r.id !== id);
        showSuccessToast('Removed from Draft');
      }
    },
  },
});

export const { setReportInDraft, removeReportFromDraft, mountingDraft } = draftsSlice.actions;

export default draftsSlice.reducer;
