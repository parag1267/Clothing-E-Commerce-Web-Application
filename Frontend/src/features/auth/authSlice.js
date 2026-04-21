import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    user: null,
    isAuthenticated: false,
    loginLoading: false,
    registerLoading: false,
    profileLoading: false,
    appLoading: true,
    logoutLoading: false,
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
                return rejectWithValue("blocked")
            }
            return rejectWithValue(null)
        }
    }
)

// authSlice.js
export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            await axios.post(
                "http://localhost:5000/api/auth/logout",
                {},
                { withCredentials: true }
            )
        } catch (error) {
            rejectWithValue(error.response?.data?.message || "Logout failed")
        } finally {
            dispatch(logout())
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.appLoading = false;
            state.logoutLoading = false;
        },
        setAppLoading: (state, action) => {
            state.appLoading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.registerLoading = true;
                state.error = null;
            })

            .addCase(registerUser.fulfilled, (state, action) => {
                state.registerLoading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })

            .addCase(registerUser.rejected, (state, action) => {
                state.registerLoading = false;
                state.error = action.payload;
            })

            .addCase(loginUser.pending, (state) => {
                state.loginLoading = true;
                state.error = null;
            })

            .addCase(loginUser.fulfilled, (state, action) => {
                state.loginLoading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })

            .addCase(loginUser.rejected, (state, action) => {
                state.loginLoading = false;
                state.error = action.payload;
                state.user = null;
                state.isAuthenticated = false;
            })

            .addCase(fetchUserProfile.pending, (state) => {
                state.profileLoading = true;
                state.error = null;
            })

            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.appLoading = false;
                state.profileLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })

            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.profileLoading = false;
                state.appLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload;
            })

            .addCase(logoutUser.pending, (state) => {
                state.logoutLoading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.logoutLoading = false;
                state.user = null;        
                state.isAuthenticated = false;       
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.logoutLoading = false;
                state.error = action.payload;
            })
    }
})


export const { logout } = authSlice.actions;
export default authSlice.reducer;