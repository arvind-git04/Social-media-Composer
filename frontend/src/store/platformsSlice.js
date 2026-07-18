import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedPlatformIds: ['x', 'ig'],
  availablePlatforms: [
    { id: 'fb', name: 'Facebook' },
    { id: 'ig', name: 'Instagram' },
    { id: 'x', name: 'X' },
    { id: 'reddit', name: 'Reddit' },
    { id: 'quora', name: 'Quora' },
    { id: 'pinterest', name: 'Pinterest' },
  ],
}

const platformsSlice = createSlice({
  name: 'platforms',
  initialState,
  reducers: {
    togglePlatform(state, action) {
      const platformId = action.payload
      if (state.selectedPlatformIds.includes(platformId)) {
        state.selectedPlatformIds = state.selectedPlatformIds.filter((id) => id !== platformId)
      } else {
        state.selectedPlatformIds.push(platformId)
      }
    },
    setSelectedPlatforms(state, action) {
      state.selectedPlatformIds = action.payload
    },
  },
})

export const { togglePlatform, setSelectedPlatforms } = platformsSlice.actions
export const selectAvailablePlatforms = (state) => state.platforms.availablePlatforms
export const selectSelectedPlatformIds = (state) => state.platforms.selectedPlatformIds
export default platformsSlice.reducer
