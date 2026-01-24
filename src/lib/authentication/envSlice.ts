import { createAppSlice } from "../../app/createAppSlice"
import { appSettings } from "../../config/env"
import type { AppSettingsType } from "../../config/global"

const initialState: AppSettingsType = appSettings

export const envSlice = createAppSlice({
  name: "env",
  initialState: initialState,
  reducers: {},
})

// eslint-disable-next-line @typescript-eslint/unbound-method
export const appSettingsSelector = envSlice.selectSlice
