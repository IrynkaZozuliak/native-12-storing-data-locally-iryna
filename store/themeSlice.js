import { createSlice } from "@reduxjs/toolkit";
import { COLORS_DARK, COLORS_LIGHT } from "../constants";

const initialState = {
  isDark: true,
  colors: COLORS_DARK,
};

const themeSlice = createSlice({
  name: "theme",
  initialState: initialState,
  reducers: {
    setInitial(state, action) {
      state.isDark = action.payload;
      state.colors = state.isDark ? COLORS_DARK : COLORS_LIGHT;
    },
    toggle(state) {
      state.isDark = !state.isDark;
      state.colors = state.isDark ? COLORS_DARK : COLORS_LIGHT;
    },
  },
});

export const themeActions = themeSlice.actions;

export default themeSlice;
