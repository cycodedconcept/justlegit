import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    name: '',
    email: '',
    phone_number: '',
    isLoading: false,
    success: {},
    error: null,
    spinItem: false,
    spinItem2: false,
    spinItem3: false,
    menus: [],
    users: [],
    menu_id: '',
    admin_user_id: '',
    bank_name: '',
    account_name: '',
    account_number: '',
    payment_public_key: '',
    payment_secrete_key: ''
}

export const adminUser = createAsyncThunk(
    'admin/createAdminUser',
    async ({token, rawData}, { rejectWithValue }) => {
        try {
            const response = await axios.post('https://legithairng.com/backend/admin/create_admin_user',
                rawData,
            {
                headers: { 
                   "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                }
            })
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create Admin user');
        }
    }
);

export const getMenus = createAsyncThunk(
    'admin/getAllMenus',
    async ({token}, { rejectWithValue }) => {
        try {
           const response = await axios.get('https://legithairng.com/backend/admin/get_menu', {
                headers: { 
                    Authorization: `Bearer ${token}` 
                } 
           })
           return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to get menus');
        }
    }
);

export const assignMenu = createAsyncThunk(
    'admin/asignMenu',
    async ({token, menuData}, { rejectWithValue }) => {
        try {
            const response = await axios.post('https://legithairng.com/backend/admin/assign_menu', 
            menuData,
            {
                headers: { 
                    Authorization: `Bearer ${token}` 
                } 
            })
           return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to assign menu');
        }
    }
);

export const updateBankDetails = createAsyncThunk(
    'admin/updateDetails',
    async ({token, rawBank}, { rejectWithValue }) => {
        try {
            const response = await axios.post('https://legithairng.com/backend/admin/update_bank_details',
              rawBank,
            {
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            })
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update Bank details');
        }
    }
);

export const updateOnline = createAsyncThunk(
    'admin/updateOnline',
    async ({token, rawOnline}, { rejectWithValue }) => {
        try {
            const response = await axios.post('https://legithairng.com/backend/admin/update_online_payment', 
              rawOnline, 
            {
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            })
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update online details');
        }
    }
);

export const showUsers = createAsyncThunk(
    'admin/users',
    async ({token}, {rejectWithValue}) => {
        try {
            const response = await axios.get('https://legithairng.com/backend/admin/get_admin_user', {
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            })
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to get admin users')
        }
    }
)

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setAdminFormData: (state, action) => {
            state[action.payload.field] = action.payload.value;
        },
        setUpdateDetails: (state, action) => {
            state[action.payload.field] = action.payload.value;
        },
        setUpdateOnline: (state, action) => {
            state[action.payload.field] = action.payload.value;
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(adminUser.pending, (state) => {
            state.spinItem = true;
            state.error = null;
          })
          .addCase(adminUser.fulfilled, (state, action) => {
            state.spinItem = false;
            state.success = action.payload;
          })
          .addCase(adminUser.rejected, (state, action) => {
            state.spinItem = false;
            state.error = action.payload;
          })
          .addCase(getMenus.pending, (state) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(getMenus.fulfilled, (state, action) => {
              state.isLoading = false,
              state.menus = action.payload;
          })
          .addCase(getMenus.rejected, (state, action) => {
              state.isLoading = false;
              state.error = action.payload;
          })
          .addCase(assignMenu.pending, (state) => {
            state.spinItem3 = true;
            state.error = null;
          })
          .addCase(assignMenu.fulfilled, (state, action) => {
            state.spinItem3 = false;
            state.success = action.payload;
          })
          .addCase(assignMenu.rejected, (state, action) => {
            state.spinItem3 = false;
            state.error = action.payload;
          })
          .addCase(updateBankDetails.pending, (state) => {
            state.spinItem = true;
            state.error = null;
          })
          .addCase(updateBankDetails.fulfilled, (state, action) => {
              state.spinItem = false;
              state.success = action.payload;
          })
          .addCase(updateBankDetails.rejected, (state, action) => {
            state.spinItem = false;
            state.error = action.payload;
          })
          .addCase(updateOnline.pending, (state) => {
            state.spinItem2 = true;
            state.error = null;
          })
          .addCase(updateOnline.fulfilled, (state, action) => {
              state.spinItem2 = false;
              state.success = action.payload;
          })
          .addCase(updateOnline.rejected, (state, action) => {
            state.spinItem2 = false;
            state.error = action.payload;
          })
          .addCase(showUsers.pending, (state) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(showUsers.fulfilled, (state, action) => {
            state.isLoading = true;
            state.users = action.payload;
          })
          .addCase(showUsers.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
          })
    }
})

export const { setAdminFormData, setUpdateDetails, setUpdateOnline } = adminSlice.actions;
export default adminSlice.reducer;