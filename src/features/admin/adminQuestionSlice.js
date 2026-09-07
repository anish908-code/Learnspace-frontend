import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { getApiError } from "../../utils/api";
import {
    getQuizQuestions,
    createQuestion,
    bulkCreateQuestions,
    updateQuestion,
    deleteQuestion,
} from "../../api/adminApi";

/*
|--------------------------------------------------------------------------
| Thunks
|--------------------------------------------------------------------------
*/

export const fetchAdminQuestions = createAsyncThunk(
    "adminQuestions/fetchAll",

    async (quizId, { rejectWithValue }) => {
        try {
            const response = await getQuizQuestions(quizId);

            return {
                quiz: response.data.quiz,
                questions: response.data.questions,
                meta: response.data.meta,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const addQuestion = createAsyncThunk(
    "adminQuestions/create",

    async ({ quizId, data }, { rejectWithValue }) => {
        try {
            const response = await createQuestion(quizId, data);

            return {
                message: response.data.message,
                question: response.data.question,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const bulkAddQuestions = createAsyncThunk(
    "adminQuestions/bulkCreate",

    async ({ quizId, questions }, { rejectWithValue }) => {
        try {
            const response = await bulkCreateQuestions(quizId, questions);

            return {
                message: response.data.message,
                questions: response.data.questions,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const editQuestion = createAsyncThunk(
    "adminQuestions/update",

    async ({ quizId, id, data }, { rejectWithValue }) => {
        try {
            const response = await updateQuestion(quizId, id, data);

            return {
                message: response.data.message,
                question: response.data.question,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const removeQuestion = createAsyncThunk(
    "adminQuestions/delete",

    async ({ quizId, id }, { rejectWithValue }) => {
        try {
            await deleteQuestion(quizId, id);

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

const adminQuestionSlice = createSlice({
    name: "adminQuestions",

    initialState: {
        quiz: null,
        questions: [],
        meta: null,

        loading: false,
        saving: false,
        successMessage: null,
        error: null,
        validationErrors: null,
    },

    reducers: {
        clearAdminQuestionFeedback: (state) => {
            state.successMessage = null;
            state.error = null;
            state.validationErrors = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchAdminQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchAdminQuestions.fulfilled, (state, action) => {
                state.loading = false;
                state.quiz = action.payload.quiz;
                state.questions = action.payload.questions;
                state.meta = action.payload.meta;
            })

            .addCase(fetchAdminQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            })

            .addCase(addQuestion.pending, (state) => {
                state.saving = true;
                state.successMessage = null;
                state.error = null;
                state.validationErrors = null;
            })

            .addCase(addQuestion.fulfilled, (state, action) => {
                state.saving = false;
                state.successMessage = action.payload.message;
                toast.success(action.payload.message);

                if (
                    !state.questions.some((q) => q.id === action.payload.question.id)
                ) {
                    state.questions.push(action.payload.question);
                }
            })

            .addCase(addQuestion.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload?.message || null;
                state.validationErrors = action.payload?.errors || null;
                toast.error(action.payload?.message || "Failed to create question.");
            })

            .addCase(bulkAddQuestions.pending, (state) => {
                state.saving = true;
                state.successMessage = null;
                state.error = null;
                state.validationErrors = null;
            })

            .addCase(bulkAddQuestions.fulfilled, (state, action) => {
                state.saving = false;
                state.successMessage = action.payload.message;
                toast.success(action.payload.message);

                action.payload.questions.forEach((question) => {
                    if (!state.questions.some((q) => q.id === question.id)) {
                        state.questions.push(question);
                    }
                });
            })

            .addCase(bulkAddQuestions.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload?.message || null;
                state.validationErrors = action.payload?.errors || null;
                toast.error(action.payload?.message || "Failed to import questions.");
            })

            .addCase(editQuestion.pending, (state) => {
                state.saving = true;
                state.successMessage = null;
                state.error = null;
                state.validationErrors = null;
            })

            .addCase(editQuestion.fulfilled, (state, action) => {
                state.saving = false;
                state.successMessage = action.payload.message;
                toast.success(action.payload.message);

                const index = state.questions.findIndex(
                    (question) => question.id === action.payload.question.id
                );

                if (index !== -1) {
                    state.questions[index] = action.payload.question;
                }
            })

            .addCase(editQuestion.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload?.message || null;
                state.validationErrors = action.payload?.errors || null;
                toast.error(action.payload?.message || "Failed to update question.");
            })

            .addCase(removeQuestion.pending, (state) => {
                state.error = null;
            })

            .addCase(removeQuestion.fulfilled, (state, action) => {
                state.successMessage = "Question deleted successfully";
                state.questions = state.questions.filter(
                    (question) => question.id !== action.payload.id
                );
                toast.success("Question deleted successfully");
            })

            .addCase(removeQuestion.rejected, (state, action) => {
                state.error = action.payload?.message || null;
                toast.error(action.payload?.message || "Failed to delete question.");
            });
    },
});

export const { clearAdminQuestionFeedback } = adminQuestionSlice.actions;

export default adminQuestionSlice.reducer;
