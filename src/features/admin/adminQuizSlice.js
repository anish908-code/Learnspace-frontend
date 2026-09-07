import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { getApiError } from "../../utils/api";
import {
    getQuizzes,
    createQuiz,
    updateQuiz,
    deleteQuiz,
} from "../../api/adminApi";

/*
|--------------------------------------------------------------------------
| Thunks
|--------------------------------------------------------------------------
*/

export const fetchAdminQuizzes = createAsyncThunk(
    "adminQuizzes/fetchAll",

    async (_, { rejectWithValue }) => {
        try {
            const response = await getQuizzes();

            return {
                quizzes: response.data.quizzes,
                meta: response.data.meta,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const addQuiz = createAsyncThunk(
    "adminQuizzes/create",

    async (data, { rejectWithValue }) => {
        try {
            const response = await createQuiz(data);

            return {
                message: response.data.message,
                quiz: response.data.quiz,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const editQuiz = createAsyncThunk(
    "adminQuizzes/update",

    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await updateQuiz(id, data);

            return {
                message: response.data.message,
                quiz: response.data.quiz,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const removeQuiz = createAsyncThunk(
    "adminQuizzes/delete",

    async (id, { rejectWithValue }) => {
        try {
            await deleteQuiz(id);

            return { id };
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

const adminQuizSlice = createSlice({
    name: "adminQuizzes",

    initialState: {
        quizzes: [],
        meta: null,

        loading: false,
        saving: false,
        successMessage: null,
        error: null,
        validationErrors: null,
    },

    reducers: {
        clearAdminQuizFeedback: (state) => {
            state.successMessage = null;
            state.error = null;
            state.validationErrors = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchAdminQuizzes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchAdminQuizzes.fulfilled, (state, action) => {
                state.loading = false;
                state.quizzes = action.payload.quizzes;
                state.meta = action.payload.meta;
            })

            .addCase(fetchAdminQuizzes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            })

            .addCase(addQuiz.pending, (state) => {
                state.saving = true;
                state.successMessage = null;
                state.error = null;
                state.validationErrors = null;
            })

            .addCase(addQuiz.fulfilled, (state, action) => {
                state.saving = false;
                state.successMessage = action.payload.message;
                toast.success(action.payload.message);

                if (!state.quizzes.some((q) => q.id === action.payload.quiz.id)) {
                    state.quizzes.unshift(action.payload.quiz);
                }
            })

            .addCase(addQuiz.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload?.message || null;
                state.validationErrors = action.payload?.errors || null;
                toast.error(action.payload?.message || "Failed to create quiz.");
            })

            .addCase(editQuiz.pending, (state) => {
                state.saving = true;
                state.successMessage = null;
                state.error = null;
                state.validationErrors = null;
            })

            .addCase(editQuiz.fulfilled, (state, action) => {
                state.saving = false;
                state.successMessage = action.payload.message;
                toast.success(action.payload.message);

                const index = state.quizzes.findIndex(
                    (quiz) => quiz.id === action.payload.quiz.id
                );

                if (index !== -1) {
                    state.quizzes[index] = {
                        ...state.quizzes[index],
                        ...action.payload.quiz,
                    };
                }
            })

            .addCase(editQuiz.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload?.message || null;
                state.validationErrors = action.payload?.errors || null;
                toast.error(action.payload?.message || "Failed to update quiz.");
            })

            .addCase(removeQuiz.pending, (state) => {
                state.error = null;
            })

            .addCase(removeQuiz.fulfilled, (state, action) => {
                state.successMessage = "Quiz deleted successfully";
                state.quizzes = state.quizzes.filter(
                    (quiz) => quiz.id !== action.payload.id
                );
                toast.success("Quiz deleted successfully");
            })

            .addCase(removeQuiz.rejected, (state, action) => {
                state.error = action.payload?.message || null;
                toast.error(action.payload?.message || "Failed to delete quiz.");
            });
    },
});

export const { clearAdminQuizFeedback } = adminQuizSlice.actions;

export default adminQuizSlice.reducer;
