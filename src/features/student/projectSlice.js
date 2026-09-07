import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getApiError } from "../../utils/api";
import {
    getProjects,
    getProjectDetail,
} from "../../api/studentApi";

/*
|--------------------------------------------------------------------------
| Thunks
|--------------------------------------------------------------------------
*/

export const fetchProjects = createAsyncThunk(
    "studentProjects/fetchAll",

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

export const fetchProjectDetail = createAsyncThunk(
    "studentProjects/fetchDetail",

    async (id, { rejectWithValue }) => {
        try {
            const response = await getProjectDetail(id);

            return {
                project: response.data.project,
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

const projectSlice = createSlice({
    name: "studentProjects",

    initialState: {
        projects: [],
        meta: null,

        currentProject: null,

        loading: false,
        error: null,
    },

    reducers: {
        clearCurrentProject: (state) => {
            state.currentProject = null;
        },

        clearProjectError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;

                state.projects = action.payload.projects;
                state.meta = action.payload.meta;
            })

            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            })

            .addCase(fetchProjectDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentProject = null;
            })

            .addCase(fetchProjectDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProject = action.payload.project;
            })

            .addCase(fetchProjectDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            });
    },
});

export const { clearCurrentProject, clearProjectError } = projectSlice.actions;

export default projectSlice.reducer;
