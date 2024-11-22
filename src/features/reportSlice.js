import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    isLoading: false,
    error: null,
    data: null
}

export const getCustomerReport = createAsyncThunk(
    'report/getCustomerReport',
    async ({token, item}, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://legithairng.com/backend/admin/reports?type=${item}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
          return rejectWithValue(error.response?.data || 'Failed to fetch customer data');
        }
    }
);

const reportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
         .addCase(getCustomerReport.pending, (state) => {
            state.isLoading = true;
            state.error = null;
         })
         .addCase(getCustomerReport.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
         })
         .addCase(getCustomerReport.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
         })
    }
})

export default reportSlice.reducer;
