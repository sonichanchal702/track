import { configureStore } from "@reduxjs/toolkit";
import agencyReducer from "./agencySlice";

export const AppStore = configureStore({
  reducer: {
    agency: agencyReducer,
  },
});
