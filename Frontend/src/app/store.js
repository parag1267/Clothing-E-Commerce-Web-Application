import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "../features/categories/categoriesSlice";
import subCategoriesReducer from "../features/subcategories/subCategoriesSlice";
import productReducer from "../features/products/productSlice";
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import userReducer from "../features/user/userSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        category: categoriesReducer,
        subCategory: subCategoriesReducer,
        products: productReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        users: userReducer
    }
})