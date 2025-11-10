import { type PayloadAction } from "@reduxjs/toolkit";

import { createAppSlice } from "../../app/createAppSlice";

import type { TableState } from "./tableTypes";

type TableStateSlice = Record<string, TableState | undefined>;

const initialState: TableStateSlice = {};

export const tableStateSlice = createAppSlice({
  name: "tableState",
  initialState,
  reducers: {
    setTableState: (state, action: PayloadAction<{ key: string; tableState: TableState | undefined }>) => {
      state[action.payload.key] = action.payload.tableState;
    },
    resetTableState: (state, action: PayloadAction<{ key: string }>) => {
      state[action.payload.key] = undefined;
    },
    resetAllTableStates: state => {
      Object.keys(state).forEach(key => {
        state[key] = undefined;
      });
    },
  },
  selectors: {
    getTableState: (state, key: string) => state[key],
  },
});

export const { setTableState, resetTableState, resetAllTableStates } = tableStateSlice.actions;
export const { getTableState } = tableStateSlice.selectors;

export default tableStateSlice.reducer;
