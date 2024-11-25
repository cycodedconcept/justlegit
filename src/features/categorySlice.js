import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  categories: [],
  subCategories: [],
  companyCategory: [],
  success: {},
  categoryStatus: [],
  searchValue: [],
  viewCategoryDetails: [],
  cat_idarray: [],
  isLoading: false,
  error: null,
  cat_name: '',
  cat_parent_id: '',
  catSuccess: {},
  spinItem: false,
  percentage: '',
  
  currentPage: 1,
  per_page: 10,
  pre_page: null,
  next_page: null,
  total: 0,
  total_pages: 0,
  
  viewDetailsPage: 1,
  viewDetailsTotalPages: 0,

  categoryStatusPage: 1,
  categoryStatusTotalPages: 0,

  searchValuePage: 1,
  searchValueTotalPages: 0,
};


export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://legithairng.com/backend/admin/admin_get_all_categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch categories');
    }
  }
);

export const fetchSubcategories = createAsyncThunk(
  'categories/fetchSubcategories',
  async ({token, id}, {rejectWithValue}) => {
    try {
      const response = await axios.get(`https://legithairng.com/backend/admin/get_sub_category?cat_id=${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch subcategories');
    }
  }
);

export const fetchCompanyCategory = createAsyncThunk(
  'categories/fetchCompanyCategory',
  async ({ token, page }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://legithairng.com/backend/admin/get_categories?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch company categories');
    }
  }
)

export const suspendProduct = createAsyncThunk(
  'categories/suspendProduct',
  async ({token, id}, {rejectWithValue}) => {
    try {
      const response = await axios.get(`https://legithairng.com/backend/admin/suspend_product_categories?cat_id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to suspend product');
    }
  }
);

export const fetchCategoryStatus = createAsyncThunk(
  'categories/categoryStatus',
  async ({ token, statusId, page }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://legithairng.com/backend/admin/get_categories?status=${statusId}&page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch categories with status');
    }
  }
);

export const fetchSearchValue = createAsyncThunk(
  'categories/searchValue',
  async ({ token, catId, searchValue, page }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://legithairng.com/backend/admin/get_categories?cat_id=${catId}&search_value=${searchValue}&page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch categories by search value');
    }
  }
);


export const viewDetails = createAsyncThunk(
  'categories/viewDetails',
  async ({ token, catId, page }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://legithairng.com/backend/admin/view_category_product?cat_id=${catId}&page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch category details');
    }
  }
);

export const catForm = createAsyncThunk(
  'categories/createCategory', 
  async({token, cat_name}, {rejectWithValue}) => {
    try {
      const response = await axios.post('https://legithairng.com/backend/admin/create_category', {
        cat_name
      }, {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch category details');
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategories',
  async ({token, cat_name, cat_parent_id}, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://legithairng.com/backend/admin/create_category', {
        cat_name,
        cat_parent_id
      },{
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create category');
    }
  }
);

export const bulkSuspend = createAsyncThunk(
  'categories/bulksuspend',
  async ({token, cat_idarray}, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://legithairng.com/backend/admin/bulk_cat_suspend', {
        cat_idarray
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to suspend product');
    }
  }
);

export const bulkPrice = createAsyncThunk(
  'categories/bulkPriceUpdate',
  async ({token, id, percentage}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://legithairng.com/backend/admin/bulk_update_company_prices?cat_id=${id}&percentage=${percentage}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add bulk price');
    }
  }
);


const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setViewDetailsPage: (state, action) => {
      state.viewDetailsPage = action.payload;
    },
    setCategoryStatusPage: (state, action) => {
      state.categoryStatusPage = action.payload;
    },
    setSearchValuePage: (state, action) => {
      state.searchValuePage = action.payload;
    },
    resetViewCategoryDetails: (state) => {
      state.viewCategoryDetails = [];
      state.viewDetailsPage = 1;
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchSubcategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subCategories = action.payload;
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCompanyCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompanyCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const data = action.payload;
        state.companyCategory = data.data || [];
        state.currentPage = data.page || 1;
        state.per_page = data.per_page || 10;
        state.pre_page = data.pre_page || null;
        state.next_page = data.next_page || null;
        state.total = data.total || 0;
        state.total_pages = data.total_pages || 0;
      })
      .addCase(fetchCompanyCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchCategoryStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const data = action.payload;

        state.categoryStatus = data.data || [];
        state.categoryStatusPage = data.page || 1;
        state.per_page = data.per_page || 10;
        state.pre_page = data.pre_page || null;
        state.next_page = data.next_page || null;
        state.total = data.total || 0;
        state.categoryStatusTotalPages = data.total_pages || 0;
      })
      .addCase(fetchCategoryStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchSearchValue.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSearchValue.fulfilled, (state, action) => {
        state.isLoading = false;
        const data = action.payload;

        state.searchValue = data.data || [];
        state.searchValuePage = data.page || 1;
        state.per_page = data.per_page || 10;
        state.pre_page = data.pre_page || null;
        state.next_page = data.next_page || null;
        state.total = data.total || 0;
        state.searchValueTotalPages = data.total_pages || 0;
      })
      .addCase(fetchSearchValue.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(suspendProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(suspendProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload;
      })
      .addCase(suspendProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(viewDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(viewDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        const data = action.payload;
        state.viewCategoryDetails = data.data || [];
        state.viewDetailsPage = data.page || 1;
        state.per_page = data.per_page || 10;
        state.pre_page = data.pre_page || null;
        state.next_page = data.next_page || null;
        state.total = data.total || 0;
        state.viewDetailsTotalPages = data.total_pages || 0;
      })
      .addCase(viewDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(catForm.pending, (state) => {
        state.spinItem = true;
        state.error = null;
      })
      .addCase(catForm.fulfilled, (state, action) => {
        state.spinItem = false;
        state.success = action.payload;
      })
      .addCase(catForm.rejected, (state, action) => {
        state.spinItem = false;
        state.error = action.payload;
      })
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.catSuccess = action.payload;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(bulkSuspend.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(bulkSuspend.fulfilled, (state, action) => {
        state.isLoading = true;
        state.catSuccess = action.payload;
      })
      .addCase(bulkSuspend.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(bulkPrice.pending, (state) => {
        state.spinItem = true;
        state.error = null;
      })
      .addCase(bulkPrice.fulfilled, (state, action) => {
        state.spinItem = false;
        state.success = action.payload;
      })
      .addCase(bulkPrice.rejected, (state, action) => {
        state.spinItem = false;
        state.error = action.payload;
      })
  },
});



export const { setPage, setViewDetailsPage, setCategoryStatusPage, setSearchValuePage, resetViewCategoryDetails, setCat } = categorySlice.actions;
export default categorySlice.reducer;


