import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { getApiError } from "../../utils/api";
import {
    getCourseLessons,
    createLesson,
    updateLesson,
    deleteLesson,
} from "../../api/adminApi";

/*
|--------------------------------------------------------------------------
| Thunks
|--------------------------------------------------------------------------
*/

export const fetchAdminLessons = createAsyncThunk(
    "adminLessons/fetchAll",

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

export const addLesson = createAsyncThunk(
    "adminLessons/create",

    async (data, { rejectWithValue }) => {
        try {
            const response = await createLesson(data);

            return {
                message: response.data.message,
                lesson: response.data.lesson,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const editLesson = createAsyncThunk(
    "adminLessons/update",

    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await updateLesson(id, data);

            return {
                message: response.data.message,
                lesson: response.data.lesson,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const removeLesson = createAsyncThunk(
    "adminLessons/delete",

    async ({ id, courseId }, { rejectWithValue }) => {
        try {
            await deleteLesson(id);

            return { id, courseId };
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

const adminLessonSlice = createSlice({
    name: "adminLessons",

    initialState: {
        lessons: [],
        meta: null,

        loading: false,
        saving: false,
        successMessage: null,
        error: null,
        validationErrors: null,
    },

    reducers: {
        clearAdminLessonFeedback: (state) => {
            state.successMessage = null;
            state.error = null;
            state.validationErrors = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchAdminLessons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchAdminLessons.fulfilled, (state, action) => {
                state.loading = false;
                state.lessons = action.payload.lessons;
                state.meta = action.payload.meta;
            })

            .addCase(fetchAdminLessons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            })

            .addCase(addLesson.pending, (state) => {
                state.saving = true;
                state.successMessage = null;
                state.error = null;
                state.validationErrors = null;
            })

            .addCase(addLesson.fulfilled, (state, action) => {
                state.saving = false;
                state.successMessage = action.payload.message;
                toast.success(action.payload.message);

                if (!state.lessons.some((l) => l.id === action.payload.lesson.id)) {
                    state.lessons.push(action.payload.lesson);
                    state.lessons.sort((a, b) => a.lesson_order - b.lesson_order);
                }
            })

            .addCase(addLesson.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload?.message || null;
                state.validationErrors = action.payload?.errors || null;
                toast.error(action.payload?.message || "Failed to create lesson.");
            })

            .addCase(editLesson.pending, (state) => {
                state.saving = true;
                state.successMessage = null;
                state.error = null;
                state.validationErrors = null;
            })

            .addCase(editLesson.fulfilled, (state, action) => {
                state.saving = false;
                state.successMessage = action.payload.message;
                toast.success(action.payload.message);

                const index = state.lessons.findIndex(
                    (lesson) => lesson.id === action.payload.lesson.id
                );

                if (index !== -1) {
                    state.lessons[index] = action.payload.lesson;
                }

                state.lessons.sort((a, b) => a.lesson_order - b.lesson_order);
            })

            .addCase(editLesson.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload?.message || null;
                state.validationErrors = action.payload?.errors || null;
                toast.error(action.payload?.message || "Failed to update lesson.");
            })

            .addCase(removeLesson.pending, (state) => {
                state.error = null;
            })

            .addCase(removeLesson.fulfilled, (state, action) => {
                state.successMessage = "Lesson deleted successfully";
                state.lessons = state.lessons.filter(
                    (lesson) => lesson.id !== action.payload.id
                );
                toast.success("Lesson deleted successfully");
            })

            .addCase(removeLesson.rejected, (state, action) => {
                state.error = action.payload?.message || null;
                toast.error(action.payload?.message || "Failed to delete lesson.");
            });
    },
});

export const { clearAdminLessonFeedback } = adminLessonSlice.actions;

export default adminLessonSlice.reducer;
