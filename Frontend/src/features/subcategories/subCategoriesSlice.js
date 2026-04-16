import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    subCategories: [],
    loading: false,
    error: null
}

export const fetchSubCategories = createAsyncThunk(
    "subCategory/fetchSubCategories",
    async (categorySlug = '', { rejectWithValue }) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/subCategory${categorySlug ? `?category=${categorySlug}` : ""}`);
            return res.data.subCategories;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Fetched failed");
        }
    }
)

export const addSubCategories = createAsyncThunk(
    "subCategory/addSubCategories",
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("category", data.category);
            formData.append("isActive", data.isActive);

            if (data.images) {
                formData.append("image", data.images);
            }

            const res = await axios.post(
                `http://localhost:5000/api/subCategory`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            )

            return res.data.subCategory
        } catch (error) {
            return rejectWithValue(error.response?.data || "Added failed");
        }
    }
)

export const updateSubCategories = createAsyncThunk(
    "subCategory/updateSubCategories",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("category", data.category?._id || data.category);
            formData.append("isActive", data.isActive);

            if (data.images && data.images instanceof File) {
                formData.append("image", data.images);
            }

            const res = await axios.put(
                `http://localhost:5000/api/subCategory/${id}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            )
            onsole.log("Update Response:", res.data.subCategory)
            return res.data.subCategory;
        } catch (error) {
            console.log(error.response?.data);
            return rejectWithValue(error.response?.data || "Updated failed");
        }
    }
)

export const deleteSubCategories = createAsyncThunk(
    "subCategory/deleteSubCategories",
    async(id,{rejectWithValue}) => {
        try {
            const res = await axios.delete(`http://localhost:5000/api/subCategory/${id}`)
            return id
        } catch (error) {
            return rejectWithValue(error.response?.data || "Deleted failed")
        }
    }
)

export const subCategoriesSlice = createSlice({
    name: 'subCategory',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubCategories.pending, (state) => {
                state.loading = true;
            })

            .addCase(fetchSubCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.subCategories = action.payload;
            })

            .addCase(fetchSubCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(addSubCategories.pending, (state) => {
                state.loading = true;
            })

            .addCase(addSubCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.subCategories.push(action.payload);
            })

            .addCase(addSubCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateSubCategories.pending, (state) => {
                state.loading = true;
            })

            .addCase(updateSubCategories.fulfilled, (state, action) => {
                state.loading = false;

                const index = state.subCategories.findIndex(
                    (subCategory) => subCategory._id === action.payload._id
                );

                if (index !== -1) {
                    state.subCategories[index] = action.payload;
                }
            })

            .addCase(updateSubCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteSubCategories.pending, (state) => {
                state.loading = true;
            })

            .addCase(deleteSubCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.subCategories = state.subCategories.filter(
                    (subCategory) => subCategory._id !== action.payload
                )
            })

            .addCase(deleteSubCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})


export default subCategoriesSlice.reducer;