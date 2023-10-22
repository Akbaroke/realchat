import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Review {
  id: string;
  user_id: string;
  name: string;
  email: string;
  foto: string;
  rate: number;
  comment: string;
  datetime: number;
}

const initialState: Review[] = [];

export const fetchReviews = createAsyncThunk(
  'review/fetchReviews',
  async () => {
    const response = await axios.get(import.meta.env.VITE_APP_RATING_ENDPOINT);
    return response.data;
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchReviews.fulfilled, (_, action) => {
      return action.payload;
    });
  },
});

export default reviewSlice.reducer;
