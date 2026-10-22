import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getApiError } from "../../utils/api";
import { getAnalytics } from "../../api/adminApi";

/*
|--------------------------------------------------------------------------
| Thunks
|--------------------------------------------------------------------------
*/

export const fetchAdminAnalytics = createAsyncThunk(
    "adminAnalytics/fetchAll",

    async (months = 6, { rejectWithValue }) => {
        try {
            const response = await getAnalytics(months);

            return {
                growth: response.data.growth || [],
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/

const adminAnalyticsSlice = createSlice({
    name: "adminAnalytics",

    initialState: {
        growth: [],

        loading: false,
        error: null,
    },

    reducers: {
        clearAdminAnalyticsError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchAdminAnalytics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchAdminAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.growth = action.payload.growth;
            })

            .addCase(fetchAdminAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            });
    },
});

export const { clearAdminAnalyticsError } = adminAnalyticsSlice.actions;

export default adminAnalyticsSlice.reducer;
