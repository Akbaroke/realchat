import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PersonalState {
  user_id: string;
  personal_id: string;
  foto: string;
  name: string;
  email: string;
}

const initialState: PersonalState = {
  user_id: '',
  personal_id: '',
  foto: '',
  name: '',
  email: '',
};

export const personalSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setPersonal: (state, action: PayloadAction<PersonalState>) => {
      state.user_id = action.payload.user_id;
      state.personal_id = action.payload.personal_id;
      state.foto = action.payload.foto;
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    resetPersonal: (state) => {
      state.user_id = '';
      state.personal_id = '';
      state.foto = '';
      state.name = '';
      state.email = '';
    },
  },
});

export const { setPersonal, resetPersonal } = personalSlice.actions;
export default personalSlice.reducer;
