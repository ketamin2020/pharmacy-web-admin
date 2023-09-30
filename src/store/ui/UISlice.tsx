import { createSlice } from '@reduxjs/toolkit'

const UiSlice = createSlice({
  name: 'UI',
  initialState: {
    theme: 'dark',
    loading: false,
  },
  reducers: {
    toggleLoading: (state, { payload }) => {
      state.loading = payload
    },
    toggleTheme: state => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    },
  },
})

export const { toggleLoading, toggleTheme } = UiSlice.actions

export default UiSlice.reducer
