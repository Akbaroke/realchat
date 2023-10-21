import { DataChats } from '@/hooks/useSnapshotChats';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ReplyState {
  chat: DataChats | null;
}

const initialState: ReplyState = {
  chat: null,
};

export const replySlice = createSlice({
  name: 'reply',
  initialState,
  reducers: {
    setReply: (state, action: PayloadAction<ReplyState>) => {
      state.chat = action.payload.chat;
    },
    resetReply: (state) => {
      state.chat = null;
    },
  },
});

export const { setReply, resetReply } = replySlice.actions;
export default replySlice.reducer;
