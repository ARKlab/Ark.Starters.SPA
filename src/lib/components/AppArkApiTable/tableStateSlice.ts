import { type PayloadAction } from "@reduxjs/toolkit";

import { createAppSlice } from "../../../app/createAppSlice";

import type { TableState } from "./tableTypes";

type TableStateEntry = {
  key: string;
  tableState: TableState | undefined;
};

type TableStateSlice = TableStateEntry[];

const initialState: TableStateSlice = [];

export const tableStateSlice = createAppSlice({
  name: "tableState",
  initialState,
  reducers: {
    setTableState: (
      state,
      action: PayloadAction<{ key: string; tableState: TableState | undefined; overWrite?: boolean }>,
    ) => {
      const { key, tableState, overWrite: replaceOthers = true } = action.payload;

      if (replaceOthers) {
        state.splice(0, state.length, { key, tableState });
        return;
      }

      const existing = state.find(entry => entry.key === key);
      if (existing) {
        existing.tableState = tableState;
      } else {
        state.push({ key, tableState });
      }
    },
    resetTableState: (state, action: PayloadAction<{ key: string }>) => {
      const existing = state.find(entry => entry.key === action.payload.key);
      if (existing) {
        existing.tableState = undefined;
      }
    },
    resetAllTableStates: state => {
      state.forEach(entry => {
        entry.tableState = undefined;
      });
    },
  },
  selectors: {
    getTableState: (state, key: string) => state.find(entry => entry.key === key)?.tableState,
  },
});

export const { setTableState, resetTableState, resetAllTableStates } = tableStateSlice.actions;
export const { getTableState } = tableStateSlice.selectors;

export default tableStateSlice.reducer;
