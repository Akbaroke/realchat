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

interface InitialState {
  isLoading: boolean;
  reviews: Review[];
}

const initialState: InitialState = {
  isLoading: false,
  reviews: [],
};

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
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default reviewSlice.reducer;
