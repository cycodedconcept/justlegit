import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  success: {},
  isLoading: false,
  error: null,
  fetchAllUsers: [],
  userOrders: [],
  user_id: '',
  order_id: '',
  orderDetails: {},

  currentPage: 1,
  per_page: 10,
  pre_page: null,
  next_page: null,
  total: 0,
  total_pages: 0,

  orderUsersPage: 1,
  orderUsersTotalPages: 0
};

export const getUsers = createAsyncThunk(
    'customers/users',
    async ({token, page}, { rejectWithValue}) => {
        try {
            const response = await axios.get(`https://legithairng.com/backend/admin/allusers?page=${page}`, {
                headers: { 
                    Authorization: `Bearer ${token}` 
                },
            });
            if (response && response.data && response.data.result) {
              return response.data.result;
            } else {
              return rejectWithValue('Data not available');
            }
        } catch (error) {
          return rejectWithValue(error.response?.data || 'Failed to fetch all users');
        }
    }
);

export const disableUser = createAsyncThunk(
  'customers/disableUser',
  async ({token, user_id}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://legithairng.com/backend/admin/disable_user?user_id=${user_id}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to disable users');
    }
  }
);

export const getUserOrder = createAsyncThunk(
  'customers/getUserOrder',
  async ({token, user_id}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://legithairng.com/backend/admin/user_order?user_id=${user_id}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      })
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get users orders');
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  'customers/details',
  async ({token, order_id}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://legithairng.com/backend/admin/orders_details?order_id=${order_id}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      })
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get order details');
    }
  }
)

const customerSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
      setPage: (state, action) => {
        state.currentPage = action.payload;
      },
      setOrderUsersPage: (state, action) => {
        state.orderUsersPage = action.payload;
      }
    },
    extraReducers: (builder) => {
        builder
          .addCase(getUsers.pending, (state) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(getUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            const data = action.payload;

            state.fetchAllUsers = data.data || [];
            state.currentPage = data.page || 1;
            state.per_page = data.per_page || 10;
            state.pre_page = data.pre_page || null;
            state.next_page = data.next_page || null;
            state.total = data.total || 0;
            state.total_pages = data.total_pages || 0;
          })
          .addCase(getUsers.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
          })
          .addCase(disableUser.pending, (state) => {
            state.isLoading = true;
            state.error = null
          })
          .addCase(disableUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.success = action.payload;
          })
          .addCase(disableUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
          })
          .addCase(getUserOrder.pending, (state) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(getUserOrder.fulfilled, (state, action) => {
            state.isLoading = false;
            const data = action.payload;

            state.userOrders = data.data || [];
            state.orderUsersPage = data.page || 1;
            state.per_page = data.per_page || 10;
            state.pre_page = data.pre_page || null;
            state.next_page = data.next_page || null;
            state.total = data.total || 0;
            state.orderUsersTotalPages = data.total_pages || 0;
          })
          .addCase(getUserOrder.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
          })
          .addCase(getOrderDetails.pending, (state) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(getOrderDetails.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orderDetails = action.payload;
          })
          .addCase(getOrderDetails.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
          })
    }
});

export const { setPage, setOrderUsersPage } = customerSlice.actions;
export default customerSlice.reducer;