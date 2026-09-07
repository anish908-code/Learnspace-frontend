import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getApiError } from "../../utils/api";
import {
    getStudents,
    getCourses,
    getProjects,
    getSubmissions,
} from "../../api/adminApi";

/*
|--------------------------------------------------------------------------
| Thunks
|--------------------------------------------------------------------------
*/

export const fetchAdminOverview = createAsyncThunk(
    "adminOverview/fetchAll",

    async (_, { rejectWithValue }) => {
        try {
            const [
                studentsRes,
                coursesRes,
                projectsRes,
                submissionsRes,
            ] = await Promise.all([
                getStudents(),
                getCourses(),
                getProjects(),
                getSubmissions(),
            ]);

            const students = studentsRes.data.students;
            const courses = coursesRes.data.courses;
            const projects = projectsRes.data.projects;
            const submissions = submissionsRes.data.submissions;

            return {
                stats: {
                    totalStudents: studentsRes.data.meta?.total ?? students.length,
                    totalCourses: coursesRes.data.meta?.total ?? courses.length,
                    publishedCourses: courses.filter(
                        (course) => course.status === "published"
                    ).length,

                    totalProjects:
                        projectsRes.data.meta?.total ?? projects.length,
                    pendingSubmissions: submissions.filter(
                        (submission) =>
                            submission.status === "pending" ||
                            submission.status === "under_review"
                    ).length,
                },

                recentStudents: students.slice(0, 5),
                recentSubmissions: submissions.slice(0, 5),
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

const adminOverviewSlice = createSlice({
    name: "adminOverview",

    initialState: {
        stats: null,
        recentStudents: [],
        recentSubmissions: [],

        loading: false,
        error: null,
    },

    reducers: {
        clearAdminOverviewError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchAdminOverview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchAdminOverview.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload.stats;
                state.recentStudents = action.payload.recentStudents;
                state.recentSubmissions = action.payload.recentSubmissions;
            })

            .addCase(fetchAdminOverview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            });
    },
});

export const { clearAdminOverviewError } = adminOverviewSlice.actions;

export default adminOverviewSlice.reducer;
