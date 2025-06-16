import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    profile: {
      navigation: 'edit-profile',
    },
    sidebar: {
      collapse: false,
      dropdown: {
        route: '',
      },
    },
  },
  reducers: {
    setCollapse: state => {
      state.sidebar.collapse = !state.sidebar.collapse;
    },
    setEditProfile: (state, action) => {
      state.profile.navigation = action.payload;
    },
    setDropDown: (state, action) => {
      const { route } = action.payload;
      state.sidebar.dropdown.route = route;
    },
  },
});

export const { setCollapse, setEditProfile, setDropDown } = settingsSlice.actions;

export default settingsSlice.reducer;
