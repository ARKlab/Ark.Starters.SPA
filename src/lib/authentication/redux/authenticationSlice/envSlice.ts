import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../..";
import { CustomSettingsType } from "../../../../global";

const initialState: CustomSettingsType = window.customSettings;

export const envSlice = createSlice({
  name: "env",
  initialState: initialState,
  reducers: {},
});

export const selectCustomSettings = (state: RootState) => state.env;
export const baseUrlSelector = (state: RootState) => state.env.serviceUrl;
