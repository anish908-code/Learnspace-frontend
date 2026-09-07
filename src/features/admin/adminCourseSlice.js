import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { getApiError } from "../../utils/api";
import {
    getCourses,
    getCourseDetail,
    createCourse,
    updateCourse,
    deleteCourse,
} from "../../api/adminApi";

/*
|--------------------------------------------------------------------------
| Thunks
|--------------------------------------------------------------------------
*/

export const fetchAdminCourses = createAsyncThunk(
    "adminCourses/fetchAll",

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

export const fetchAdminCourseDetail = createAsyncThunk(
    "adminCourses/fetchDetail",

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

export const addCourse = createAsyncThunk(
    "adminCourses/create",

    async (data, { rejectWithValue }) => {
        try {
            const response = await createCourse(data);

            return {
                message: response.data.message,
                course: response.data.course,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const editCourse = createAsyncThunk(
    "adminCourses/update",

    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await updateCourse(id, data);

            return {
                message: response.data.message,
                course: response.data.course,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const removeCourse = createAsyncThunk(
    "adminCourses/delete",

    async (id, { rejectWithValue }) => {
        try {
            const response = await deleteCourse(id);

            return {
                message: response.data.message,
                id,
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

const adminCourseSlice = createSlice({
    name: "adminCourses",

    initialState: {
        courses: [],
        meta: null,

        currentCourse: null,

        loading: false,

        /*
         * Form ke liye alag state — list ka loading disturb na ho.
         */
        saving: false,
        successMessage: null,
        error: null,
        validationErrors: null,
    },

    reducers: {
        clearCurrentAdminCourse: (state) => {
            state.currentCourse = null;
        },

        clearAdminCourseFeedback: (state) => {
            state.successMessage = null;
            state.error = null;
            state.validationErrors = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchAdminCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchAdminCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload.courses;
                state.meta = action.payload.meta;
            })

            .addCase(fetchAdminCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            })

            .addCase(fetchAdminCourseDetail.pending, (state) => {
                state.loading = true;
                state.currentCourse = null;
            })

            .addCase(fetchAdminCourseDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCourse = action.payload.course;
            })

            .addCase(fetchAdminCourseDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            })

            .addCase(addCourse.pending, (state) => {
                state.saving = true;
                state.successMessage = null;
                state.error = null;
                state.validationErrors = null;
            })

            .addCase(addCourse.fulfilled, (state, action) => {
                state.saving = false;
                state.successMessage = action.payload.message;
                state.courses.unshift(action.payload.course);
                toast.success(action.payload.message);
            })

            .addCase(addCourse.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload?.message || null;
                state.validationErrors = action.payload?.errors || null;
                toast.error(action.payload?.message || "Failed to create course.");
            })

            .addCase(editCourse.pending, (state) => {
                state.saving = true;
                state.successMessage = null;
                state.error = null;
                state.validationErrors = null;
            })

            .addCase(editCourse.fulfilled, (state, action) => {
                state.saving = false;
                state.successMessage = action.payload.message;
                toast.success(action.payload.message);

                const index = state.courses.findIndex(
                    (course) => course.id === action.payload.course.id
                );

                if (index !== -1) {
                    state.courses[index] = {
                        ...state.courses[index],
                        ...action.payload.course,
                    };
                }

                if (
                    state.currentCourse &&
                    state.currentCourse.id === action.payload.course.id
                ) {
                    state.currentCourse = {
                        ...state.currentCourse,
                        ...action.payload.course,
                    };
                }
            })

            .addCase(editCourse.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload?.message || null;
                state.validationErrors = action.payload?.errors || null;
                toast.error(action.payload?.message || "Failed to update course.");
            })

            .addCase(removeCourse.pending, (state) => {
                state.error = null;
            })

            .addCase(removeCourse.fulfilled, (state, action) => {
                state.successMessage = action.payload.message;
                state.courses = state.courses.filter(
                    (course) => course.id !== action.payload.id
                );
                toast.success(action.payload.message);
            })

            .addCase(removeCourse.rejected, (state, action) => {
                state.error = action.payload?.message || null;
                toast.error(action.payload?.message || "Failed to delete course.");
            });
    },
});

export const {
    clearCurrentAdminCourse,
    clearAdminCourseFeedback,
} = adminCourseSlice.actions;

export default adminCourseSlice.reducer;
