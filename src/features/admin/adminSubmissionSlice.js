import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { getApiError } from "../../utils/api";
import { getSubmissions, reviewSubmission } from "../../api/adminApi";

/*
|--------------------------------------------------------------------------
| Thunks
|--------------------------------------------------------------------------
*/

export const fetchAdminSubmissions = createAsyncThunk(
    "adminSubmissions/fetchAll",

    async (_, { rejectWithValue }) => {
        try {
            const response = await getSubmissions();

            return {
                submissions: response.data.submissions,
                meta: response.data.meta,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const submitReview = createAsyncThunk(
    "adminSubmissions/review",

    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await reviewSubmission(id, data);

            return {
                message: response.data.message,
                submission: response.data.submission,
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

const adminSubmissionSlice = createSlice({
    name: "adminSubmissions",

    initialState: {
        submissions: [],
        meta: null,

        loading: false,
        saving: false,
        successMessage: null,
        error: null,
    },

    reducers: {
        clearAdminSubmissionFeedback: (state) => {
            state.successMessage = null;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchAdminSubmissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchAdminSubmissions.fulfilled, (state, action) => {
                state.loading = false;
                state.submissions = action.payload.submissions;
                state.meta = action.payload.meta;
            })

            .addCase(fetchAdminSubmissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            })

            .addCase(submitReview.pending, (state) => {
                state.saving = true;
                state.successMessage = null;
                state.error = null;
            })

            .addCase(submitReview.fulfilled, (state, action) => {
                state.saving = false;
                state.successMessage = action.payload.message;
                toast.success(action.payload.message);

                const index = state.submissions.findIndex(
                    (submission) => submission.id === action.payload.submission.id
                );

                if (index !== -1) {
                    state.submissions[index] = action.payload.submission;
                }
            })

            .addCase(submitReview.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload?.message || null;
                toast.error(action.payload?.message || "Failed to save review.");
            });
    },
});

export const { clearAdminSubmissionFeedback } = adminSubmissionSlice.actions;

export default adminSubmissionSlice.reducer;
