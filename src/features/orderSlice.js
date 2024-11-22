import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  order: {},
  orderDetails: {},
  invoicedata: {},
  isLoading: false,
  error: null,
  order_id: '',
  delivery_status: '',
  success: false,
  data: {},
  currentPage: 1,
  per_page: 10,
  pre_page: null,
  next_page: null,
  total: 0,
  total_pages: 0,

  product: [],
  productPage: 1,
  productTotalPages: 0,

  invoiceCurrentPage: 1,
  invoicePerPage: 10,
  invoiceTotalPages: 0,

  orderCurrentPage: 1,
  orderPerPage: 10,
  orderTotalPages: 0,

}

export const getOrder = createAsyncThunk(
  'orders/fetchOrders',
  async ({token, page}, {rejectWithValue}) => {
    try {
      const response = await axios.get(`https://legithairng.com/backend/admin/get_orders?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

export const fetchDetails = createAsyncThunk(
    'orders/fetchDetails',
    async ({token, id}, {rejectWithValue}) => {
        try {
            const response = await axios.get(`https://legithairng.com/backend/admin/orders_details?order_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return response.data;
        } catch (error) {
          return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
);

export const updateStatus = createAsyncThunk(
    'orders/changeStatus',
    async ({ token, order_id, delivery_status }, {rejectWithValue}) => {
        try {
            const response = await axios.post('https://legithairng.com/backend/admin/update_delivery_status', {
                order_id,
                delivery_status
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data;
        } catch (error) {
          return rejectWithValue(error.response?.data || 'Something went wrong');
            
        }
    }
);

export const productItem = createAsyncThunk(
  'orders/productItem',
  async ({token, page}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://legithairng.com/backend/admin/admin_get_product?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

export const allInvoice = createAsyncThunk(
  'orders/allInvoice',
  async ({token}, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://legithairng.com/backend/admin/get_all_invoice", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
)

const createOrderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
      clearStatusUpdate: (state) => {
        state.success = false;
      },
      setOrderPage: (state, action) => {
        state.orderCurrentPage = action.payload;
      },
      setInvoicePage: (state, action) => {
        state.invoiceCurrentPage = action.payload;
      },
      setPageProduct: (state, action) => {
        state.productPage = action.payload;
      }
    },
    extraReducers: (builder) => {
        builder
          .addCase(getOrder.pending, (state) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(getOrder.fulfilled, (state, action) => {
            state.isLoading = false;
            const data = action.payload;
            state.order = data.data || [];
            state.orderCurrentPage = data.page || 1;
            state.orderPerPage = data.per_page || 10;
            state.orderTotalPages = data.total_pages || 0;
          })    
          .addCase(getOrder.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || 'Something went wrong';
          })
          .addCase(fetchDetails.pending, (state) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(fetchDetails.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orderDetails = action.payload;
          })
          .addCase(fetchDetails.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || 'Something went wrong';
          })
          .addCase(updateStatus.pending, (state) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(updateStatus.fulfilled, (state, action) => {
            state.success = true;
            state.data = action.payload;
          })
          .addCase(updateStatus.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || 'Something went wrong';
          })
          .addCase(productItem.pending, (state) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(productItem.fulfilled, (state, action) => {
            state.isLoading = false;
            const data = action.payload;
            state.product = data.data || [];
            state.productPage = data.page || 1;
            state.productTotalPages = data.total_pages || 0;
          })    
          .addCase(productItem.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
          })
          .addCase(allInvoice.pending, (state) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(allInvoice.fulfilled, (state, action) => {
            state.isLoading = false;
            const data = action.payload;
            state.invoicedata = data.data || [];
            state.invoiceCurrentPage = data.page || 1;
            state.invoicePerPage = data.per_page || 10;
            state.invoiceTotalPages = data.total_pages || 0;
          })    
          .addCase(allInvoice.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
          })
    }
});

export const { clearStatusUpdate, setOrderPage, setInvoicePage, setPageProduct } = createOrderSlice.actions;
export default createOrderSlice.reducer;
