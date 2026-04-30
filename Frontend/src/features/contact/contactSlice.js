import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";


const initialState = {
    loading: false,
    success: false,
    error: null,
    allMessages: [],
    unreadMessages: [],
    allLoading: false,
    allError: null,
    markLoading: false,
    markError: null
}

export const sendContactMessage = createAsyncThunk(
    'contact/sendContactmessage',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await axios.post('http://localhost:5000/api/contact', formData)
            return res.data
        } catch (error) {
            if (error.response) {
                return rejectWithValue(error.response.data.message || 'Something went wrong')
            }
            return rejectWithValue(error.message || 'Server error, please try again')
        }
    }
)

export const fetchUnreadMessages = createAsyncThunk(
    'contact/fetchUnreadMessages',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get('http://localhost:5000/api/contact', {
                withCredentials: true
            })
            return res.data
        } catch (error) {
            if (error.response) {
                return rejectWithValue(error.response.data.message || 'Something went wrong')
            }
            return rejectWithValue(error.message || 'Server error, please try again')
        }
    }
)

export const fetchAllMessages = createAsyncThunk(
    'contact/fetchAllMessages',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get('http://localhost:5000/api/contact/all-message', {
                withCredentials: true
            })
            return res.data
        } catch (error) {
            if (error.response) {
                return rejectWithValue(error.response.data.message || 'Something went wrong')
            }
            return rejectWithValue(error.message || 'Server error, please try again')
        }
    }
)

export const markMessage = createAsyncThunk(
    'contact/markMessage',
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.patch(`http://localhost:5000/api/contact/${id}/read`, {}, {
                withCredentials: true
            })
            return res.data
        } catch (error) {
            if (error.response) {
                return rejectWithValue(error.response.data.message || 'Something went wrong')
            }
            return rejectWithValue(error.message || 'Server error, please try again')
        }
    }
)

const contactSlice = createSlice({
    name: "contact",
    initialState,
    reducers: {
        resetContactState: (state) => {
            state.loading = true,
                state.success = false,
                state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendContactMessage.pending, (state) => {
                state.loading = true,
                    state.success = false,
                    state.error = null
            })

            .addCase(sendContactMessage.fulfilled, (state, action) => {
                state.loading = false,
                    state.success = true,
                    state.error = null
            })

            .addCase(sendContactMessage.rejected, (state, action) => {
                state.loading = false,
                    state.success = false,
                    state.error = action.payload
            })

            .addCase(fetchUnreadMessages.pending, (state) => {
                state.allLoading = true,
                    state.allError = null,
                    state.success = false
            })

            .addCase(fetchUnreadMessages.fulfilled, (state, action) => {
                state.allLoading = false,
                    state.allError = null,
                    state.unreadMessages = action.payload.data
            })

            .addCase(fetchUnreadMessages.rejected, (state, action) => {
                state.allLoading = false,
                    state.success = false,
                    state.allError = action.payload
            })

            .addCase(fetchAllMessages.pending, (state) => {
                state.allLoading = true,
                    state.allError = null,
                    state.success = false
            })

            .addCase(fetchAllMessages.fulfilled, (state, action) => {
                state.allLoading = false,
                    state.allError = null,
                    state.allMessages = action.payload.data
            })

            .addCase(fetchAllMessages.rejected, (state, action) => {
                state.allLoading = false,
                    state.success = false,
                    state.allError = action.payload
            })

            .addCase(markMessage.pending, (state) => {
                state.markLoading = true,
                    state.markError = null
            })

            .addCase(markMessage.fulfilled, (state, action) => {
                state.markLoading = false;
                const updated = action.payload.data

                state.allMessages = state.allMessages.map(msg =>
                    msg._id === updated._id ? updated : msg
                )

                state.unreadMessages = state.unreadMessages.filter(
                    msg => msg._id !== updated._id
                )
            })

            .addCase(markMessage.rejected, (state, action) => {
                state.markLoading = false
                state.markError = action.payload
            })
    }
})


export const { resetContactState } = contactSlice.actions
export default contactSlice.reducer