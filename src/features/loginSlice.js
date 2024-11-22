import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    login: '',
    password: '',
    spinItem: false,
    error: null,
    successful: false,
    data: []
};

export const submitForm = createAsyncThunk(
    'login',
    async ({ login, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post('https://legithairng.com/backend/admin/login-admin', {
                login,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            localStorage.setItem("key", response.data.token);
            localStorage.setItem("menus", JSON.stringify(response.data.menus));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const selectMenus = (state) => state.login.data.menus;

const formLoginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setLoginFormData: (state, action) => {
          state[action.payload.field] = action.payload.value;
        },
        resetLoginState: (state) => {
            // Reset to initial state
            state.login = '';
            state.password = '';
            state.spinItem = false;
            state.error = null;
            state.successful = false;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(submitForm.pending, (state) => {
            state.spinItem = true;
            state.error = null
        })
        .addCase(submitForm.fulfilled, (state, action) => {
            state.spinItem = false;
            state.successful = true;
            state.data = action.payload
        })
        .addCase(submitForm.rejected, (state, action) => {
            state.spinItem = false;
            state.error = action.payload;
        });
    }
})

export const { setLoginFormData, resetLoginState } = formLoginSlice.actions;
export default formLoginSlice.reducer;