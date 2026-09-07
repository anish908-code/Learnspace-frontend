import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { getApiError } from "../../utils/api";
import {
    getNotifications,
    markNotificationAsRead,
    clearNotifications,
} from "../../api/studentApi";

/*
|--------------------------------------------------------------------------
| Thunks
|--------------------------------------------------------------------------
*/

export const fetchNotifications = createAsyncThunk(
    "studentNotifications/fetchAll",

    async (_, { rejectWithValue }) => {
        try {
            const response = await getNotifications();

            return {
                notifications: response.data.notifications,
                meta: response.data.meta,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const markNotificationRead = createAsyncThunk(
    "studentNotifications/markRead",

    async (id, { rejectWithValue }) => {
        try {
            const response = await markNotificationAsRead(id);

            return response.data.notification;
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const clearAllNotifications = createAsyncThunk(
    "studentNotifications/clearAll",

    async (_, { rejectWithValue }) => {
        try {
            const response = await clearNotifications();

            return response.data.message;
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

const notificationSlice = createSlice({
    name: "studentNotifications",

    initialState: {
        notifications: [],
        meta: null,

        loading: false,

        error: null,
    },

    reducers: {
        clearNotificationError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;

                state.notifications = action.payload.notifications;
                state.meta = action.payload.meta;
            })

            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            })

            .addCase(markNotificationRead.fulfilled, (state, action) => {
                state.notifications = state.notifications.map((notification) =>
                    notification.id === action.payload.id
                        ? action.payload
                        : notification
                );
            })

            .addCase(markNotificationRead.rejected, (state, action) => {
                state.error = action.payload?.message || null;
                toast.error(action.payload?.message || "Failed to update notification.");
            })

            .addCase(clearAllNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(clearAllNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = [];
                state.meta = null;
                toast.success(action.payload || "All notifications cleared");
            })

            .addCase(clearAllNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
                toast.error(action.payload?.message || "Failed to clear notifications.");
            });
    },
});

export const { clearNotificationError } = notificationSlice.actions;

export default notificationSlice.reducer;
