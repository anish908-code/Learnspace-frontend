import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    getStudentProfile,
    getEnrollments,
    getNotifications,
} from "../../api/studentApi";

export const fetchStudentDashboard = createAsyncThunk(
    "student/fetchDashboard",
    async (_, { rejectWithValue }) => {
        try {
            const [profileResponse, enrollmentsResponse, notificationsResponse] =
                await Promise.all([
                    getStudentProfile(),
                    getEnrollments(),
                    getNotifications(),
                ]);

            return {
                profile: profileResponse.data.student,
                enrollments: enrollmentsResponse.data.enrollments,
                enrollmentsMeta: enrollmentsResponse.data.meta,
                notifications: notificationsResponse.data.notifications,
                notificationsMeta: notificationsResponse.data.meta,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to load dashboard",
                }
            );
        }
    }
);

const initialState = {
    profile: null,
    enrollments: [],
    notifications: [],

    enrollmentsMeta: null,
    notificationsMeta: null,

    loading: false,
    error: null,
};

const studentSlice = createSlice({
    name: "student",

    initialState,

    reducers: {
        clearStudentError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchStudentDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchStudentDashboard.fulfilled, (state, action) => {
                state.loading = false;

                state.profile = action.payload.profile;

                state.enrollments = action.payload.enrollments;
                state.enrollmentsMeta = action.payload.enrollmentsMeta;

                state.notifications = action.payload.notifications;
                state.notificationsMeta = action.payload.notificationsMeta;
            })

            .addCase(fetchStudentDashboard.rejected, (state, action) => {
                state.loading = false;

                state.error =
                    action.payload?.message ||
                    "Failed to load student dashboard.";
            });
    },
});

export const { clearStudentError } = studentSlice.actions;

export default studentSlice.reducer;