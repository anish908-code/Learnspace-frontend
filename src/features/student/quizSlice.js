import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { getApiError } from "../../utils/api";
import { getQuiz, submitQuiz } from "../../api/studentApi";

/*
|--------------------------------------------------------------------------
| Thunks
|--------------------------------------------------------------------------
*/

export const fetchQuiz = createAsyncThunk(
    "studentQuiz/fetch",

    async (id, { rejectWithValue }) => {
        try {
            const response = await getQuiz(id);

            return {
                quiz: response.data.quiz,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const submitQuizAnswers = createAsyncThunk(
    "studentQuiz/submit",

    async ({ id, answers }, { rejectWithValue }) => {
        try {
            const response = await submitQuiz(id, answers);

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
    quiz: null,

    result: null,

    loading: false,

    submitting: false,

    error: null,
};

const quizSlice = createSlice({
    name: "studentQuiz",

    initialState,

    reducers: {
        clearCurrentQuiz: (state) => {
            state.quiz = null;
            state.result = null;
        },

        clearQuizError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchQuiz.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.quiz = null;
                state.result = null;
            })

            .addCase(fetchQuiz.fulfilled, (state, action) => {
                state.loading = false;
                state.quiz = action.payload.quiz;
            })

            .addCase(fetchQuiz.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            })

            .addCase(submitQuizAnswers.pending, (state) => {
                state.submitting = true;
                state.error = null;
            })

            .addCase(submitQuizAnswers.fulfilled, (state, action) => {
                state.submitting = false;
                state.result = action.payload;
                toast.success("Quiz submitted successfully");
            })

            .addCase(submitQuizAnswers.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload?.message || null;
                toast.error(action.payload?.message || "Failed to submit quiz.");
            });
    },
});

export const { clearCurrentQuiz, clearQuizError } = quizSlice.actions;

export default quizSlice.reducer;
