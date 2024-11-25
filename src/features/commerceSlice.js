import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    products: [],
    delivery_address: '',
    delivery_state: '',
    delivery_country: '',
    amount_paid: '',
    additional_information: '',
    payment_method: '',
    delivery_landmark: '',
    invoice_id: '',
    customer_name: '',
    customer_phonenumber: '',
    customer_email: '',
    error: null,
    success: false,
    data: {},
    spinItem: false,
    redirect_url: '',
    invoiceData: [],
    land: [],
    countryData: []
}

export const createInvoice = createAsyncThunk(
    'commerce/createInvoice',
    async ({token, 
         products, delivery_address, 
         delivery_state, delivery_country, 
         amount_paid, additional_information, 
         payment_method, delivery_landmark, invoice_id,
         customer_name, customer_phonenumber, customer_email, redirect_url
        }, { rejectWithValue }) => {
        try {
            const response = await axios.post('https://legithairng.com/backend/admin/create_invoice', {
                products, delivery_address, 
                delivery_state, delivery_country, 
                amount_paid, additional_information, 
                payment_method, delivery_landmark, invoice_id,
                customer_name, customer_phonenumber, customer_email,redirect_url
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return response.data;
        } catch (error) {
          const errorMessage = error.response?.data || error.message || 'Something went wrong';
          console.error('Error response:', errorMessage);
          return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
);


export const getInvoiceData = createAsyncThunk(
    'commerce/getInvoiceData',
    async ({token, invoice_id}, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://legithairng.com/backend/admin/get_invoice_data?invoiceid=${invoice_id}`, {
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

export const getLandMark = createAsyncThunk(
  'commerce/getLandMark',
  async ({stateItem},{ rejectWithValue }) => {
    try {
      const response = await axios.get(`https://legithairng.com/backend/user/get_landmark?state=${stateItem}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
)

export const getCountries = createAsyncThunk(
  'commerce/getCountries',
  async (_, { rejectWithValue}) => {
    try {
      const response = await axios.get('https://countriesnow.space/api/v0.1/countries/states', {
        headers: {
          'Content-Type': 'application/json',
      }
      })
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
)

const commerceSlice = createSlice({
    name: 'commerce',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
          .addCase(createInvoice.pending, (state) => {
            state.success = false;
            state.spinItem = true;
            state.error = null;
          })
          .addCase(createInvoice.fulfilled, (state, action) => {
            state.success = true;
            state.spinItem = false;
            state.data = action.payload;
          })
          .addCase(createInvoice.rejected, (state, action) => {
            state.success = false;
            state.spinItem = false;
            state.error = action.payload || 'Something went wrong';
          })
          .addCase(getInvoiceData.pending, (state) => {
            state.success = false;
            state.error = null;
          })
          .addCase(getInvoiceData.fulfilled, (state, action) => {
            state.success = true;
            state.invoiceData = action.payload;
          })
          .addCase(getInvoiceData.rejected, (state, action) => {
            state.success = false;
            state.error = action.payload || 'Something went wrong';
          })
          .addCase(getLandMark.pending, (state) => {
            state.success = false;
            state.error = null;
          })
          .addCase(getLandMark.fulfilled, (state, action) => {
            state.success = true;
            state.land = action.payload;
          })
          .addCase(getLandMark.rejected, (state, action) => {
            state.success = false;
            state.error = action.payload || 'Something went wrong';
          })
          .addCase(getCountries.pending, (state) => {
            state.success = false;
            state.error = null;
          })
          .addCase(getCountries.fulfilled, (state, action) => {
            state.success = true;
            state.countryData = action.payload;

            if (action.payload && Array.isArray(action.payload.data)) {
              localStorage.setItem('fetchedData', JSON.stringify(action.payload.data));
          } else {
              console.error("Fetched data is not in the expected format:", action.payload);
          }
      
          })
          .addCase(getCountries.rejected, (state, action) => {
            state.success = false;
            state.error = action.payload || 'Something went wrong';
          })
    }
});


export default commerceSlice.reducer;

