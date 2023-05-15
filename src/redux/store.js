import { configureStore } from "@reduxjs/toolkit";
import PRApplicationReducer from "src/redux/state-slice";

const store = configureStore({ reducer: PRApplicationReducer });
export default store;
