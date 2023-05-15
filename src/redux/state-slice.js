import { createSlice } from "@reduxjs/toolkit";
import GetCookies from "src/utils/pr/get-cookies";

const PRApplicationSlice = createSlice({
  name: "pr_application",
  initialState: { cookies: "", pr_info: { pr_list: [] } },
  reducers: {
    updateCookies: (state, action) => {
      state.cookies = action.payload;
    },
    updatePRInfo: (state, action) => {
      state.pr_info = { ...state.pr_info, ...action.payload };
    },
  },
});

export const storeAction = PRApplicationSlice.actions;
export default PRApplicationSlice.reducer;
