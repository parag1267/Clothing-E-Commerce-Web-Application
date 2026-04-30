import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";
import { act } from "react";

const initialState = {
    users: [],
    user: null,
    loading: false,
    error: null,
    total: 0,
    totalPages: 0
}

export const getUsers = createAsyncThunk(
    "users/getUsers",
    async ({ page, limit, search, role = "", status = "" }, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/admin/users?page=${page}&limit=${limit}&search=${search || ""}&role=${role}&status=${status}`,
                { withCredentials: true }
            );

            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Get Users failed")
        }
    }
)


export const getUser = createAsyncThunk(
    "users/getUser",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/admin/users/${id}`,
                { withCredentials: true }
            );
            return res.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Get User failed")
        }
    }
)

export const createUser = createAsyncThunk(
    "users/createUser",
    async (userData, {rejectWithValue}) => {
        try {
            const res = await axios.post(
                "http://localhost:5000/api/admin/users/create",
                userData,
                {withCredentials: true}
            ) 
            return res.data.user;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Create user failed"
            )
        }
    }
)

export const deleteUser = createAsyncThunk(
    "users/deleteUser",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.delete(
                `http://localhost:5000/api/admin/users/${id}`,
                { withCredentials: true }
            );

            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Delete user failed")
        }
    }
)


export const toggleUserStatus = createAsyncThunk(
    "users/toggleUserStatus",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.patch(
                `http://localhost:5000/api/admin/users/${id}/status`,
                {},
                { withCredentials: true }
            );

            return res.data.user
        } catch (error) {
            console.log("TOGGLE ERROR FULL:", error); // 👈 IMPORTANT
            console.log("TOGGLE ERROR DATA:", error.response?.data);
            return rejectWithValue(
                error.response?.data?.message || "Toggle status failed"
            )
        }
    }
)
const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
                state.total = action.payload.total;
                state.totalPages = action.payload.totalPages;
            })

            .addCase(getUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getUser.pending, (state) => {
                state.loading = false;
                state.error = null;
            })

            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })

            .addCase(getUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(createUser.pending,(state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createUser.fulfilled,(state,action) => {
                state.loading = false;
                state.users.unshift(action.payload);
                state.total += 1;
            })

            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(u => u._id !== action.payload);
                state.total = state.total - 1;
            })

            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(toggleUserStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(toggleUserStatus.fulfilled, (state, action) => {
                state.loading = false;

                const updatedUser = action.payload;
                const index = state.users.map(user =>
                    user._id === updatedUser._id
                        ? { ...user, isActive: updatedUser.isActive }
                        : user
                )
            })

            .addCase(toggleUserStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export default userSlice.reducer;