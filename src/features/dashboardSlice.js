import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isLoading: false,
  error: null,
  graphData: [],
  board: {}
}

export const getGraph = createAsyncThunk(
    'dashboard/graphs',
    async ({token}, { rejectWithValue }) => {
        try {
            const response = await axios.get('https://legithairng.com/backend/admin/orders_graph', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
          return rejectWithValue(error.response?.data || 'Failed to fetch graph data');
        }
    }
);

export const adminBoard = createAsyncThunk(
    'dashboard/dashboardDetails',
    async ({token}, { rejectWithValue }) => {
        try {
            const response = await axios.get('https://legithairng.com/backend/admin/admin_dashboard', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
          return rejectWithValue(error.response?.data || 'Failed to dashboard data');
        }
    }
)

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getGraph.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(getGraph.fulfilled, (state, action) => {
            state.isLoading = false;
            state.graphData = action.payload;
        })
        .addCase(getGraph.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        .addCase(adminBoard.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(adminBoard.fulfilled, (state, action) => {
            state.isLoading = false;
            state.board = action.payload;
        })
        .addCase(adminBoard.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
    }
})

export default dashboardSlice.reducer;