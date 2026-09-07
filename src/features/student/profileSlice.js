import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { getApiError } from "../../utils/api";
import {
    getStudentProfile,
    updateStudentProfile,
} from "../../api/studentApi";

/*
|--------------------------------------------------------------------------
| Thunks
|--------------------------------------------------------------------------
*/

export const fetchProfile = createAsyncThunk(
    "studentProfile/fetch",

    async (_, { rejectWithValue }) => {
        try {
            const response = await getStudentProfile();

            return {
                student: response.data.student,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const saveProfile = createAsyncThunk(
    "studentProfile/update",

    async (data, { rejectWithValue }) => {
        try {
            const response = await updateStudentProfile(data);

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

const profileSlice = createSlice({
    name: "studentProfile",

    initialState: {
        profile: null,

        loading: false,

        saving: false,

        error: null,
        validationErrors: null,
    },

    reducers: {
        clearProfileError: (state) => {
            state.error = null;
            state.validationErrors = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload.student;
            })

            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            })

            .addCase(saveProfile.pending, (state) => {
                state.saving = true;
                state.error = null;
                state.validationErrors = null;
            })

            .addCase(saveProfile.fulfilled, (state, action) => {
                state.saving = false;
                state.profile = action.payload.student;
                toast.success(action.payload.message || "Profile updated successfully");
            })

            .addCase(saveProfile.rejected, (state, action) => {
                state.saving = false;

                state.error = action.payload?.message || null;
                state.validationErrors = action.payload?.errors || null;
                toast.error(action.payload?.message || "Failed to update profile.");
            });
    },
});

export const { clearProfileError } = profileSlice.actions;

export default profileSlice.reducer;
