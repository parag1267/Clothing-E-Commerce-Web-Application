import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";

const initialState = {
    wishlist: [],
    loading: false,
    error: null,
}

export const getWishlist = createAsyncThunk(
    "wishlist/getWishlist",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get("http://localhost:5000/api/wishlist", {
                withCredentials: true
            });

            return res.data.wishlist.products;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const moveToCart = createAsyncThunk(
    "wishlist/moveToCart",
    async (productId,{rejectWithValue}) => {
        try {
            const res = await axios.post(
                `http://localhost:5000/api/wishlist/move-to-cart`,
                {productId},
                {withCredentials: true}
            )

            return res.data.cart.items;
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const toggleWishlist = createAsyncThunk(
    "wishlist/toggleWishlist",
    async (productId, { rejectWithValue }) => {
        try {
            const res = await axios.post("http://localhost:5000/api/wishlist/toggle",
                { productId },
                { withCredentials: true }
            );

            return res.data.wishlist.products
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const removeFromWishlist = createAsyncThunk(
    "wishlist/removeWishlist",
    async (productId, { rejectWithValue }) => {
        try {
            const res = await axios.delete(`http://localhost:5000/api/wishlist/${productId}`, {
                withCredentials: true
            });

            return res.data.wishlist.products;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const clearWishlist = createAsyncThunk(
    "wishlist/clearWishlist",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.delete(`http://localhost:5000/api/wishlist`, {
                withCredentials: true
            });

            return res.data.wishlist.products;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        resetWishlist: (state) => {
            state.wishlist = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getWishlist.fulfilled,(state,action) => {
                state.loading = false;
                state.wishlist = action.payload;
            })

            .addCase(getWishlist.rejected,(state,action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(moveToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(moveToCart.fulfilled,(state,action) => {
                state.loading = false;
                const moveProductId = action.meta.arg;
                state.wishlist = state.wishlist.filter(
                    item => (item._id || item).toString() !== moveProductId.toString()
                )
            })

            .addCase(moveToCart.rejected,(state,action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(toggleWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(toggleWishlist.fulfilled,(state,action) => {
                state.loading = false;
                state.wishlist = action.payload;
            })

            .addCase(toggleWishlist.rejected,(state,action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(removeFromWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(removeFromWishlist.fulfilled,(state,action) => {
                state.loading = false;
                const removedId = action.meta.arg;
                state.wishlist = state.wishlist.filter(
                    item => (item._id || item).toString() !== removedId.toString()
                )
            })

            .addCase(removeFromWishlist.rejected,(state,action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(clearWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(clearWishlist.fulfilled,(state,action) => {
                state.loading = false;
                state.wishlist = action.payload;
            })

            .addCase(clearWishlist.rejected,(state,action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export const {resetWishlist} = wishlistSlice.actions;
export default wishlistSlice.reducer;