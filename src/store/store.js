import { configureStore } from '@reduxjs/toolkit';
import formLoginReducer from '../features/loginSlice';
import allProductsReducer from '../features/allProductSlice';
import categoryReducer from '../features/categorySlice';
import productReducer from '../features/createProductSlice';
import orderReducer from '../features/orderSlice';
import customerReducer from '../features/customerSlice';
import adminReducer from '../features/adminSlice';
import dashboardReducer from '../features/dashboardSlice';
import reportReducer from '../features/reportSlice';
import commerceReducer from '../features/commerceSlice'


const store = configureStore({
  reducer: {
    login: formLoginReducer,
    allProducts: allProductsReducer,
    categories: categoryReducer,
    product: productReducer,
    order: orderReducer,
    customers: customerReducer,
    admin: adminReducer,
    dashboard: dashboardReducer,
    report: reportReducer,
    commerce: commerceReducer
  },
});

export default store;
