import { ListRooms } from '@/components/views/PersonalView';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  isLoading: boolean;
  roomsPersonal: ListRooms[];
}

const initialState: InitialState = {
  isLoading: false,
  roomsPersonal: [],
};

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setRoomPersonal: (state, action: PayloadAction<ListRooms[]>) => {
      state.roomsPersonal = action.payload;
    },
    resetRoom: (state) => {
      state.isLoading = initialState.isLoading;
      state.roomsPersonal = initialState.roomsPersonal;
    },
  },
});

export const { setLoading, setRoomPersonal, resetRoom } = roomSlice.actions;
export default roomSlice.reducer;
