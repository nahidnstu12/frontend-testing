import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type TableState = {
  page: number;
  page_size: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  status?: string;
  // ...add more as needed
};

type State = Record<string, TableState>;

const initialState: State = {};

const datatableSlice = createSlice({
  name: 'datatable',
  initialState,
  reducers: {
    initTable: (state, action: PayloadAction<{ key: string; initial: TableState }>) => {
      if (!state[action.payload.key]) {
        state[action.payload.key] = action.payload.initial;
      }
    },
    setTableParams: (state, action: PayloadAction<{ key: string; params: Partial<TableState> }>) => {
      if (state[action.payload.key]) {
        Object.entries(action.payload.params).forEach(([k, v]) => {
          if (v === undefined || v === null || v === '' || v === 'all') {
            delete (state[action.payload.key] as any)[k];
          } else {
            (state[action.payload.key] as any)[k] = v;
          }
        });
      }
    },
    resetTable: (state, action: PayloadAction<{ key: string }>) => {
      if (state[action.payload.key]) {
        state[action.payload.key] = { page: 1, page_size: 10 };
      }
    },
  },
});

export const { initTable, setTableParams, resetTable } = datatableSlice.actions;
export default datatableSlice.reducer;