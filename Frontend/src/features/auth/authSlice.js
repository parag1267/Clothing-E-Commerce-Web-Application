import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    user: null,
    loading: false,
    error: null
}

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                "http://localhost:5000/api/auth/signup",
                userData,
                { withCredentials: true }
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Registeration failed"
            );
        }
    }
)

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                "http://localhost:5000/api/auth/signin",
                userData,
                { withCredentials: true }
            );
            return res.data;
        } catch (error) {
            if (error.response?.status === 403) {
                return rejectWithValue("Your account is bloacked by admin"
                );
            }
            return rejectWithValue(
                error.response?.data?.message || "Login failed"
            );
        }
    }
)

export const fetchUserProfile = createAsyncThunk(
    "auth/fetchUserProfile",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/auth/profile",
                { withCredentials: true }
            );
            return res.data.user;
        } catch (error) {
            if (error.response?.status === 403) {
                return rejectWithValue("Block account")
            }
            return rejectWithValue(null)
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })

            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })

            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.user = null;
            })

            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })

            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                if(action.payload === "blocked"){
                    state.user = null;
                }
                state.error = action.payload;
            })
    }
})


export const { logout } = authSlice.actions;
export default authSlice.reducer;