import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { getApiError } from "../../utils/api";
import {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
} from "../../api/adminApi";

/*
|--------------------------------------------------------------------------
| Thunks
|--------------------------------------------------------------------------
*/

export const fetchAdminProjects = createAsyncThunk(
    "adminProjects/fetchAll",

    async (_, { rejectWithValue }) => {
        try {
            const response = await getProjects();

            return {
                projects: response.data.projects,
                meta: response.data.meta,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const addProject = createAsyncThunk(
    "adminProjects/create",

    async (data, { rejectWithValue }) => {
        try {
            const response = await createProject(data);

            return {
                message: response.data.message,
                project: response.data.project,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const editProject = createAsyncThunk(
    "adminProjects/update",

    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await updateProject(id, data);

            return {
                message: response.data.message,
                project: response.data.project,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const removeProject = createAsyncThunk(
    "adminProjects/delete",

    async (id, { rejectWithValue }) => {
        try {
            await deleteProject(id);

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

const adminProjectSlice = createSlice({
    name: "adminProjects",

    initialState: {
        projects: [],
        meta: null,

        loading: false,
        saving: false,
        successMessage: null,
        error: null,
        validationErrors: null,
    },

    reducers: {
        clearAdminProjectFeedback: (state) => {
            state.successMessage = null;
            state.error = null;
            state.validationErrors = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchAdminProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchAdminProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload.projects;
                state.meta = action.payload.meta;
            })

            .addCase(fetchAdminProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            })

            .addCase(addProject.pending, (state) => {
                state.saving = true;
                state.successMessage = null;
                state.error = null;
                state.validationErrors = null;
            })

            .addCase(addProject.fulfilled, (state, action) => {
                state.saving = false;
                state.successMessage = action.payload.message;
                toast.success(action.payload.message);

                if (
                    !state.projects.some((p) => p.id === action.payload.project.id)
                ) {
                    state.projects.unshift(action.payload.project);
                }
            })

            .addCase(addProject.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload?.message || null;
                state.validationErrors = action.payload?.errors || null;
                toast.error(action.payload?.message || "Failed to create project.");
            })

            .addCase(editProject.pending, (state) => {
                state.saving = true;
                state.successMessage = null;
                state.error = null;
                state.validationErrors = null;
            })

            .addCase(editProject.fulfilled, (state, action) => {
                state.saving = false;
                state.successMessage = action.payload.message;
                toast.success(action.payload.message);

                const index = state.projects.findIndex(
                    (project) => project.id === action.payload.project.id
                );

                if (index !== -1) {
                    state.projects[index] = {
                        ...state.projects[index],
                        ...action.payload.project,
                    };
                }
            })

            .addCase(editProject.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload?.message || null;
                state.validationErrors = action.payload?.errors || null;
                toast.error(action.payload?.message || "Failed to update project.");
            })

            .addCase(removeProject.pending, (state) => {
                state.error = null;
            })

            .addCase(removeProject.fulfilled, (state, action) => {
                state.successMessage = "Project deleted successfully";
                state.projects = state.projects.filter(
                    (project) => project.id !== action.payload.id
                );
                toast.success("Project deleted successfully");
            })

            .addCase(removeProject.rejected, (state, action) => {
                state.error = action.payload?.message || null;
                toast.error(action.payload?.message || "Failed to delete project.");
            });
    },
});

export const { clearAdminProjectFeedback } = adminProjectSlice.actions;

export default adminProjectSlice.reducer;
