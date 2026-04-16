import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    cart: {
        items: []
    },
    loading: false,
    error: null
}

export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/cart",
                { withCredentials: true }
            );
            return res.data.cart;
        } catch (error) {
            if (error.response?.status === 401) {
                window.location.href = "/login";
            }
            return rejectWithValue(error.message?.data || "Something went wrong");
        }
    }
)

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async (data, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                "http://localhost:5000/api/cart/add",
                data,
                { withCredentials: true }
            );
            return res.data.cart;
        } catch (error) {
            if (error.response?.status === 401) {
                window.location.href = "/login";
            }
            return rejectWithValue(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
);


export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (data, { rejectWithValue }) => {
        try {
            const res = await axios.delete(
                "http://localhost:5000/api/cart/remove",
                { 
                    data,
                    withCredentials: true 
                }
            );
            return res.data.cart;
        } catch (error) {
            if (error.response?.status === 401) {
                window.location.href = "/login";
            }
            return rejectWithValue(error.message?.data || "Something went wrong");
        }
    }
)

export const updateCartItem = createAsyncThunk(
    "cart/updateCartItem",
    async (data, { rejectWithValue }) => {
        try {
            const res = await axios.put(
                "http://localhost:5000/api/cart/update",
                data,
                { withCredentials: true }
            );
            return res.data.cart;
        } catch (error) {
            if (error.response?.status === 401) {
                window.location.href = "/login";
            }
            return rejectWithValue(error.message?.data || "Something went wrong");
        }
    }
)


const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCart: (state) => {
            state.cart = {items: []}
        }   
    },
    extraReducers: (builder) => {
        builder
            //Fetch Cart 
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //Add To Cart 
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Remove from Cart
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Updat Cart Item
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})


export const { clearCart } =cartSlice.actions;
export default cartSlice.reducer;