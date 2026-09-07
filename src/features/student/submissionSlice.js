import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { getApiError } from "../../utils/api";
import {
    getSubmissions,
    createSubmission,
} from "../../api/studentApi";

/*
|--------------------------------------------------------------------------
| Thunks
|--------------------------------------------------------------------------
*/

export const fetchSubmissions = createAsyncThunk(
    "studentSubmissions/fetchAll",

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

export const submitProject = createAsyncThunk(
    "studentSubmissions/create",

    async (data, { rejectWithValue }) => {
        try {
            const response = await createSubmission(data);

            return response.data;
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

const initialState = {
    submissions: [],
    meta: null,

    loading: false,

    submitting: false,

    error: null,
    validationErrors: null,
};

const submissionSlice = createSlice({
    name: "studentSubmissions",

    initialState,

    reducers: {
        clearSubmissionError: (state) => {
            state.error = null;
            state.validationErrors = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchSubmissions.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.validationErrors = null;
            })

            .addCase(fetchSubmissions.fulfilled, (state, action) => {
                state.loading = false;

                state.submissions = action.payload.submissions;
                state.meta = action.payload.meta;
            })

            .addCase(fetchSubmissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            })

            .addCase(submitProject.pending, (state) => {
                state.submitting = true;
                state.error = null;
                state.validationErrors = null;
            })

            .addCase(submitProject.fulfilled, (state, action) => {
                state.submitting = false;

                state.submissions = [
                    action.payload.submission,
                    ...state.submissions,
                ];

                if (state.meta) {
                    state.meta.total += 1;
                }

                toast.success(action.payload.message || "Project submitted successfully");
            })

            .addCase(submitProject.rejected, (state, action) => {
                state.submitting = false;

                state.error = action.payload?.message || null;
                state.validationErrors = action.payload?.errors || null;
                toast.error(action.payload?.message || "Failed to submit project.");
            });
    },
});

export const { clearSubmissionError } = submissionSlice.actions;

export default submissionSlice.reducer;
