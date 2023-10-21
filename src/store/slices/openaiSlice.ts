import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OpenaiState {
  question: string;
  result: string;
}

const initialState: OpenaiState = {
  question: '',
  result: '',
};

export const openaiSlice = createSlice({
  name: 'openai',
  initialState,
  reducers: {
    setOpenai: (state, action: PayloadAction<OpenaiState>) => {
      state.question = action.payload.question;
      state.result = action.payload.result;
    },
    resetOpenai: (state) => {
      state.question = '';
      state.result = '';
    },
  },
});

export const { setOpenai, resetOpenai } = openaiSlice.actions;
export default openaiSlice.reducer;
