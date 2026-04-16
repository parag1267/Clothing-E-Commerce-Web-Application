import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    orders: [],
    allOrders: [],
    currentOrder: null,
    savedAddresses: [],
    total: 0,
    totalPages: 0,
    error: null
}

export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (data, { rejectWithValue }) => {
        try {
            const res = await axios.post("http://localhost:5000/api/order", data, {
                withCredentials: true
            })

            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Order Creation failed");
        }
    }
)

export const fetchMyOrder = createAsyncThunk(
    "order/fetchMyOrder",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get("http://localhost:5000/api/order/my", {
                withCredentials: true
            })

            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Order Creation failed");
        }
    }
)

export const fetchSavedAddresses = createAsyncThunk(
    "order/fetchSavedAddressed",
    async (_,{rejectWithValue}) => {
        try {
            const res = await axios.get("http://localhost:5000/api/order/saved-address",{withCredentials: true})
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch address")
        }
    }
)

export const fetchSingleOrder = createAsyncThunk(
    "order/fetchSingleOrder",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/order/${id}`, {
                withCredentials: true
            })

            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Order Creation failed");
        }
    }
)

export const fetchAllOrder = createAsyncThunk(
    "order/fetchAllOrder",
    async ({page,limit,search}, { rejectWithValue }) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/order?page=${page}&limit=${limit}&search=${search || ""}`, {
                withCredentials: true
            })

            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Order Creation failed");
        }
    }
)

export const updateOrderStatus = createAsyncThunk(
    "order/updateOrderStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/order/${id}/status`,
                { status },
                { withCredentials: true }
            )

            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Order Creation failed");
        }
    }
)

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        clearOrderState: (state) => {
            state.currentOrder = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // ───────────── createOrder ─────────────
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.order) {
                    state.orders.unshift(action.payload.order);
                    state.currentOrder = action.payload.order;
                }
            })

            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ───────────── fetchSingleOrder ─────────────
            .addCase(fetchSingleOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchSingleOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload.order;
            })

            .addCase(fetchSingleOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ───────────── fetchSavedAddresses ─────────────
            .addCase(fetchSavedAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchSavedAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.savedAddresses = action.payload.addresses || []
            })

            .addCase(fetchSavedAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ───────────── fetchMyOrder ─────────────
            .addCase(fetchMyOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchMyOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders || []
            })

            .addCase(fetchMyOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ───────────── fetchAllOrder ─────────────
            .addCase(fetchAllOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchAllOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.allOrders = action.payload.success
                    ? action.payload.orders || []
                    : [];
                state.total = action.payload.total;
                state.totalPages = action.payload.totalPages;
            })

            .addCase(fetchAllOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ───────────── updateOrderStatus ─────────────
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload.order;
                const adminIdx = state.allOrders.findIndex(o => o._id === updated._id);
                if (adminIdx !== -1) state.allOrders[adminIdx] = updated;

                const userIdx = state.orders.findIndex(o => o._id === updated._id);
                if (userIdx !== -1) state.orders[userIdx] = updated;

                state.currentOrder = updated;
            })

            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})
export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;