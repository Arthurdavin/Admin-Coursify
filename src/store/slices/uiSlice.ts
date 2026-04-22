import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UIState {
  sidebarOpen: boolean
  modalOpen: boolean
  modalType: 'create' | 'edit' | 'delete' | null
  modalData: Record<string, any> | null
  searchQuery: string
  filterParams: Record<string, any>
  currentPage: number
  pageSize: number
}

const initialState: UIState = {
  sidebarOpen: true,
  modalOpen: false,
  modalType: null,
  modalData: null,
  searchQuery: '',
  filterParams: {},
  currentPage: 1,
  pageSize: 10,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },

    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },

    openModal: (
      state,
      action: PayloadAction<{
        type: 'create' | 'edit' | 'delete'
        data?: Record<string, any>
      }>
    ) => {
      state.modalOpen = true
      state.modalType = action.payload.type
      state.modalData = action.payload.data || null
    },

    closeModal: (state) => {
      state.modalOpen = false
      state.modalType = null
      state.modalData = null
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.currentPage = 1
    },

    setFilterParams: (
      state,
      action: PayloadAction<Record<string, any>>
    ) => {
      state.filterParams = action.payload
      state.currentPage = 1
    },

    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },

    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload
      state.currentPage = 1
    },

    resetFilters: (state) => {
      state.searchQuery = ''
      state.filterParams = {}
      state.currentPage = 1
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  setSearchQuery,
  setFilterParams,
  setCurrentPage,
  setPageSize,
  resetFilters,
} = uiSlice.actions

export default uiSlice.reducer
