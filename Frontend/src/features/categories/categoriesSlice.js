import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    categories: [],
    loading: false,
    error: null
}

export const fetchCategories = createAsyncThunk(
    "category/fetch",
    async (_,{rejectWithValue}) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/category`);
            return res.data.categories;
        } catch (error) {
            return rejectWithValue(error.response?.data?.messsage || "Fetch failed");
        }
    }
)

export const addCategories = createAsyncThunk(
    "category/add",
    async (data,{rejectWithValue}) => {
        try {
            const formData = new FormData();

            formData.append("name",data.name);
            formData.append("description",data.description);
            formData.append("isActive",data.isActive);

            if(data.images){
                formData.append("image",data.images);
            }

            const res = await axios.post(`http://localhost:5000/api/category`,formData,{
                headers: {"Content-Type": "multipart/form-data"}
            });

            return res.data.category;
        } catch (error) {
            return rejectWithValue(error.response?.data?.messsage || "Add failed");
        }
    }
)


export const updateCategories = createAsyncThunk(
    "category/update",
    async ({id,data},{rejectWithValue}) => {
        try {
            const formData = new FormData();

            formData.append("name",data.name);
            formData.append("description",data.description);
            formData.append("isActive",data.isActive);

            if(data.images){
                formData.append("image",data.images);
            }

            const res = await axios.put(`http://localhost:5000/api/category/${id}`,formData,{
                headers: {"Content-Type": "multipart/form-data"}
            })

            return res.data.category;
        } catch (error) {
            return rejectWithValue(error.response?.data?.messsage || "Fetch failed");
        }
    }
)

export const deleteCategory = createAsyncThunk(
    "category/delete",
    async (id,{rejectWithValue}) => {
        try {
            await axios.delete(`http://localhost:5000/api/category/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.messsage || "Delete failed")
        }
    }
)

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending,(state) => {
                state.loading = true;
            })
            .addCase(fetchCategories.fulfilled, (state,action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected,(state,action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(addCategories.pending,(state) => {
                state.loading = true;
            })
            .addCase(addCategories.fulfilled, (state,action) => {
                state.loading = false;
                state.categories.unshift(action.payload);
            })
            .addCase(addCategories.rejected,(state,action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateCategories.pending,(state) => {
                state.loading = true;
            })
            .addCase(updateCategories.fulfilled, (state,action) => {
                state.loading = false;
                
                const index = state.categories.findIndex(
                    (category) => category._id === action.payload._id
                );

                if(index !== -1){
                    state.categories[index] = action.payload;
                }
            })
            .addCase(updateCategories.rejected,(state,action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteCategory.pending,(state) => {
                state.loading = true;
            })
            .addCase(deleteCategory.fulfilled, (state,action) => {
                state.loading = false;
                state.categories = state.categories.filter(
                    (category) => category._id !== action.payload
                );
            })
            .addCase(deleteCategory.rejected,(state,action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})


export default categorySlice.reducer;