import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { getApiError } from "../../utils/api";
import {
    getCourseLessons,
    getLesson,
    markLessonComplete,
} from "../../api/studentApi";

/*
|--------------------------------------------------------------------------
| Thunks
|--------------------------------------------------------------------------
*/

export const fetchCourseLessons = createAsyncThunk(
    "studentLessons/fetchByCourse",

    async (courseId, { rejectWithValue }) => {
        try {
            const response = await getCourseLessons(courseId);

            return {
                lessons: response.data.lessons,
                meta: response.data.meta,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const fetchLesson = createAsyncThunk(
    "studentLessons/fetchOne",

    async (id, { rejectWithValue }) => {
        try {
            const response = await getLesson(id);

            return {
                lesson: response.data.lesson,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const completeLesson = createAsyncThunk(
    "studentLessons/complete",

    async (id, { rejectWithValue }) => {
        try {
            const response = await markLessonComplete(id);

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
    lessons: [],
    meta: null,

    currentLesson: null,

    /*
     * markComplete ke baad backend enrollment bhejta hai
     * (progress + lessons_completed) — use yahan rakhte hai.
     */
    lastCompleted: null,

    loading: false,

    completing: false,

    error: null,
};

const lessonSlice = createSlice({
    name: "studentLessons",

    initialState,

    reducers: {
        clearCurrentLesson: (state) => {
            state.currentLesson = null;
            state.lastCompleted = null;
        },

        clearLessonError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchCourseLessons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchCourseLessons.fulfilled, (state, action) => {
                state.loading = false;

                state.lessons = action.payload.lessons;
                state.meta = action.payload.meta;
            })

            .addCase(fetchCourseLessons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            })

            .addCase(fetchLesson.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentLesson = null;
            })

            .addCase(fetchLesson.fulfilled, (state, action) => {
                state.loading = false;
                state.currentLesson = action.payload.lesson;
            })

            .addCase(fetchLesson.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            })

            .addCase(completeLesson.pending, (state) => {
                state.completing = true;
                state.error = null;
            })

            .addCase(completeLesson.fulfilled, (state, action) => {
                state.completing = false;

                state.lastCompleted = {
                    message: action.payload.message,
                    enrollment: action.payload.enrollment,
                };

                toast.success(action.payload.message || "Lesson marked as complete");
            })

            .addCase(completeLesson.rejected, (state, action) => {
                state.completing = false;
                state.error = action.payload?.message || null;
                toast.error(action.payload?.message || "Failed to complete lesson.");
            });
    },
});

export const { clearCurrentLesson, clearLessonError } = lessonSlice.actions;

export default lessonSlice.reducer;
