import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getApiError } from "../../utils/api";
import { getCourses, getCourseDetail } from "../../api/studentApi";

/*
|--------------------------------------------------------------------------
| Thunks
|--------------------------------------------------------------------------
*/

export const fetchCourses = createAsyncThunk(
    "studentCourses/fetchAll",

    async (_, { rejectWithValue }) => {
        try {
            const response = await getCourses();

            return {
                courses: response.data.courses,
                meta: response.data.meta,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const fetchCourseDetail = createAsyncThunk(
    "studentCourses/fetchDetail",

    async (id, { rejectWithValue }) => {
        try {
            const response = await getCourseDetail(id);

            return {
                course: response.data.course,
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

const courseSlice = createSlice({
    name: "studentCourses",

    initialState: {
        courses: [],
        meta: null,

        currentCourse: null,

        loading: false,
        error: null,
    },

    reducers: {
        clearCurrentCourse: (state) => {
            state.currentCourse = null;
        },

        clearCourseError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.loading = false;

                state.courses = action.payload.courses;
                state.meta = action.payload.meta;
            })

            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            })

            .addCase(fetchCourseDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentCourse = null;
            })

            .addCase(fetchCourseDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCourse = action.payload.course;
            })

            .addCase(fetchCourseDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            });
    },
});

export const { clearCurrentCourse, clearCourseError } = courseSlice.actions;

export default courseSlice.reducer;
