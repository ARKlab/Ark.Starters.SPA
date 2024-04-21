import { createAppSlice } from '../../app/createAppSlice'
import type { CustomSettingsType } from '../../global'

const initialState: CustomSettingsType = window.customSettings

export const envSlice = createAppSlice({
  name: 'env',
  initialState: initialState,
  reducers: {},
  selectors: {
    baseUrlSelector: s => s.serviceUrl
  }
})

export const customSettingsSelector = envSlice.selectSlice;
export const { baseUrlSelector } = envSlice.selectors;
