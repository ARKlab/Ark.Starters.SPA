/* eslint-disable @typescript-eslint/no-restricted-imports */
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, AppState } from "./configureStore";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<AppState>();
