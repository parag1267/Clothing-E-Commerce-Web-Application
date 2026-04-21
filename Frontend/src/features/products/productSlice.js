import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { all } from "axios";

const initialState = {
    relatedProducts: [],
    trendingAll: [],
    trendingPolo: [],
    newArrivals: [],
    tabs: [],
    products: [],
    product: null,
    activeTab: "trending",
    createSuccess: false,
    updateSuccess: false,
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    availableBrands: [],
    availableSizes: [],
    counts: {
        all: 0,
        active: 0,
        inactive: 0,
        featured: 0,
        trending: 0
    }
}

export const fetchPoloTrending = createAsyncThunk(
    "products/fetchPoloTrending",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/products/polo-trending"
            );
            return res.data.trendingPolo
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
)

export const fetchNewArrivals = createAsyncThunk(
    "products/fecthNewArrivals",
    async ({ page = 1, limit } = {}, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/products/newarrival",
                {
                    params: { page, limit }
                }
            )
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
)

export const fetchTabs = createAsyncThunk(
    "products/fetchTabs",
    async (category, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/products/Allcategory/tabs/${category}`
            );
            return res.data.tabs;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
)

export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async ({ tab, sub, page = 1, limit = 20, category = "men", search = "", minPrice, maxPrice, brands, sizes, sort = "newest" }, { rejectWithValue }) => {
        try {
            const params = {
                page, limit, sort
            }

            if(category) params.category = category;

            if(sub){
                params.sub = sub;
            }
            else if(tab){
                params.tab = tab;
            }

            if(search) params.search = search;

            if(minPrice !== undefined && minPrice !== null){
                params.minPrice = minPrice;
            }

            if(maxPrice !== undefined && maxPrice !== null){
                params.maxPrice = maxPrice;
            }

            if (brands) params.brands = brands;
            if (sizes) params.sizes = sizes;

            const res = await axios.get(
                `http://localhost:5000/api/products`,
                { params }
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
)

export const fetchSingleProduct = createAsyncThunk(
    "products/fetchSingleProduct",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/products/${id}`
            )
            return res.data.product;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
)

export const fetchTrendingProductHome = createAsyncThunk(
    "products/fetchTrendingProductHome",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/products/all-trending"
            )
            return res.data.trendingAll;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
)

export const createProduct = createAsyncThunk(
    "products/createProduct",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                `http://localhost:5000/api/products`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            )
            return res.data.product;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Product create failed.")
        }
    }
)

export const updateProduct = createAsyncThunk(
    "products/updateProduct",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await axios.put(
                `http://localhost:5000/api/products/${id}`,
                data,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            )
            return res.data.product
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Product create failed.")
        }
    }
)

export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.delete(
                `http://localhost:5000/api/products/${id}`
            )
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Product create failed.")
        }
    }
)

export const fetchRelatedProducts = createAsyncThunk(
    "products/fetchRelatedProducts",
    async ({ subCategory, excludeId }, { rejectWithValue }) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/products`, {
                params: { tab: subCategory }
            })

            return res.data.products.filter(p => p._id !== excludeId)
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed Realted products")
        }
    }
)


export const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },

        resetCreateState: (state) => {
            state.createSuccess = false;
        },

        resetUpdateState: (state) => {
            state.updateSuccess = false;
        },

        clearProduct: (state) => {
            state.product = null;
        }
    },

    extraReducers: (builder) => {
        builder
            // Polo Trending
            .addCase(fetchPoloTrending.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchPoloTrending.fulfilled, (state, action) => {
                state.loading = false;
                state.trendingPolo = action.payload;
            })

            .addCase(fetchPoloTrending.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // New Arrival
            .addCase(fetchNewArrivals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchNewArrivals.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.currentPage === 1) {
                    state.newArrivals = action.payload.products;
                }
                else {
                    state.newArrivals = [...state.newArrivals, ...action.payload.products]
                }
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })

            .addCase(fetchNewArrivals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Tabs
            .addCase(fetchTabs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchTabs.fulfilled, (state, action) => {
                state.loading = false;
                state.tabs = action.payload;
            })

            .addCase(fetchTabs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Trending Product Home
            .addCase(fetchTrendingProductHome.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchTrendingProductHome.fulfilled, (state, action) => {
                state.loading = false;
                state.trendingAll = action.payload;
            })

            .addCase(fetchTrendingProductHome.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Single Product
            .addCase(fetchSingleProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchSingleProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
            })

            .addCase(fetchSingleProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Products
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.counts = action.payload.counts;
                state.availableBrands = action.payload.availableBrands || [];
                state.availableSizes = action.payload.availableSizes || [];
            })

            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create Products
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.createSuccess = false;
            })

            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.createSuccess = true;
                if (action.payload) {
                    state.products.unshift(action.payload);
                }
            })

            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.createSuccess = false;
            })

            // Update product
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.updateSuccess = false;
            })

            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.updateSuccess = true;
                state.products = state.products.map(p =>
                    p._id === action.payload._id ? action.payload : p
                );

                if (state.product?._id === action.payload._id) {
                    state.product = action.payload;
                }
            })

            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.updateSuccess = false;
            })

            // Delete product
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter(
                    p => p._id !== action.payload
                );
            })

            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Related product
            .addCase(fetchRelatedProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.relatedProducts = action.payload;
            })

            .addCase(fetchRelatedProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
})

export const { setActiveTab, resetCreateState, resetUpdateState, clearProduct } = productSlice.actions;
export default productSlice.reducer;