import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import personalReducer from './slices/personalSlice';
import openaiSlice from './slices/openaiSlice';
import replySlice from './slices/replySlice';
import reviewSlice from './slices/reviewSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    personal: personalReducer,
    openai: openaiSlice,
    reply: replySlice,
    reviews: reviewSlice,
  },
});

store.subscribe(() => {
  console.log('store change:', store.getState());
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;