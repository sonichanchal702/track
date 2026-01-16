import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("agency")) || null;

export const agencySlice = createSlice({
  name: "agency",
  initialState,
  reducers: {
    addAgency: (state, action) => {
      localStorage.setItem("agency", JSON.stringify(action.payload));
      return action.payload;
    },
    removeAgency: () => {
      localStorage.removeItem("agency");
      return null;
    },
  },
});

export const { addAgency, removeAgency } = agencySlice.actions;
export default agencySlice.reducer;
