import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getApiError } from "../../utils/api";
import { getStudents } from "../../api/adminApi";

/*
|--------------------------------------------------------------------------
| Thunks
|--------------------------------------------------------------------------
*/

export const fetchAdminStudents = createAsyncThunk(
    "adminStudents/fetchAll",

    async (_, { rejectWithValue }) => {
        try {
            const response = await getStudents();

            return {
                students: response.data.students,
                meta: response.data.meta,
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

const adminStudentSlice = createSlice({
    name: "adminStudents",

    initialState: {
        students: [],
        meta: null,

        loading: false,
        error: null,
    },

    reducers: {
        clearAdminStudentsError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchAdminStudents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchAdminStudents.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload.students;
                state.meta = action.payload.meta;
            })

            .addCase(fetchAdminStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            });
    },
});

export const { clearAdminStudentsError } = adminStudentSlice.actions;

export default adminStudentSlice.reducer;
