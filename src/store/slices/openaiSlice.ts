import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PersonalState {
  question: string;
  result: string;
}

const initialState: PersonalState = {
  question: '',
  result: '',
};

export const openaiSlice = createSlice({
  name: 'openai',
  initialState,
  reducers: {
    setOpenai: (state, action: PayloadAction<PersonalState>) => {
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
