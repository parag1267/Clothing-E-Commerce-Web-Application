import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    success: false,
    error: null
}

export const createPaymentSession = createAsyncThunk(
    "payment/createPaymentSession",
    async (orderId, { rejectWithValue }) => {
        try {
            const res = await axios.post("http://localhost:5000/api/payment/create/session", {orderId}, {
                withCredentials: true
            })

            if (res.data?.url) {
                window.location.href = res.data.url;
            }

            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Payment session  failed");
        }
    }
)

export const verifyPayment = createAsyncThunk(
    "payment/verifyPayment",
    async ({orderId,session_id}, { rejectWithValue }) => {
        try {
            const res = await axios.post("http://localhost:5000/api/payment/verify", {orderId,session_id}, {
                withCredentials: true
            })
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Payment verification failed");
        }
    }
)

const orderSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        clearOrderState: (state) => {
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPaymentSession.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createPaymentSession.fulfilled, (state, action) => {
                state.loading = false;
            })

            .addCase(createPaymentSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(verifyPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(verifyPayment.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })

            .addCase(verifyPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})
export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;