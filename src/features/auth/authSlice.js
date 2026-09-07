import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import {
    register,
    login,
    logout,
    getCurrentUser,
    forgotPassword,
    resetPassword,
} from "../../api/authApi";

/*
|--------------------------------------------------------------------------
| Helper: Extract API error
|--------------------------------------------------------------------------
*/

const getApiError = (error) => {
    return {
        status: error.response?.status ?? null,
        message:
            error.response?.data?.message ||
            "Something went wrong. Please try again.",
        errors: error.response?.data?.errors || null,
    };
};

/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {
    user: null,
    role: null,

    isAuthenticated: false,

    loading: true,
    error: null,

    validationErrors: null,

    passwordResetMessage: null,
};

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

export const registerUser = createAsyncThunk(
    "auth/registerUser",

    async (data, { rejectWithValue }) => {
        try {
            const response = await register(data);

            return response.data;
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export const loginUser = createAsyncThunk(
    "auth/loginUser",

    async (data, { rejectWithValue }) => {
        try {
            const response = await login(data);

            return response.data;
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

/*
|--------------------------------------------------------------------------
| Restore Existing Session
|--------------------------------------------------------------------------
*/

export const fetchMe = createAsyncThunk(
    "auth/fetchMe",

    async (_, { rejectWithValue }) => {
        try {
            const response = await getCurrentUser();

            return response.data;
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",

    async (_, { rejectWithValue }) => {
        try {
            const response = await logout();

            return response.data;
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

/*
|--------------------------------------------------------------------------
| Forgot Password
|--------------------------------------------------------------------------
*/

export const forgotUserPassword = createAsyncThunk(
    "auth/forgotUserPassword",

    async (data, { rejectWithValue }) => {
        try {
            const response = await forgotPassword(data);

            return response.data;
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

/*
|--------------------------------------------------------------------------
| Reset Password
|--------------------------------------------------------------------------
*/

export const resetUserPassword = createAsyncThunk(
    "auth/resetUserPassword",

    async (data, { rejectWithValue }) => {
        try {
            const response = await resetPassword(data);

            return response.data;
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

/*
|--------------------------------------------------------------------------
| Auth Slice
|--------------------------------------------------------------------------
*/

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        clearAuthError: (state) => {
            state.error = null;
            state.validationErrors = null;
        },

        clearPasswordResetMessage: (state) => {
            state.passwordResetMessage = null;
        },

        updateUser: (state, action) => {
            state.user = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder

            /*
            |--------------------------------------------------------------------------
            | REGISTER
            |--------------------------------------------------------------------------
            */

            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.validationErrors = null;
            })

            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;

                state.user = action.payload.user;
                state.role = action.payload.role;

                state.isAuthenticated = true;

                state.error = null;
                state.validationErrors = null;

                toast.success("Registration successful!");
            })

            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;

                state.error = action.payload?.message || "Registration failed.";

                state.validationErrors =
                    action.payload?.errors || null;

                toast.error(state.error || "Registration failed.");
            })

            /*
            |--------------------------------------------------------------------------
            | LOGIN
            |--------------------------------------------------------------------------
            */

            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.validationErrors = null;
            })

            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;

                state.user = action.payload.user;
                state.role = action.payload.role;

                state.isAuthenticated = true;

                state.error = null;
                state.validationErrors = null;

                toast.success("Login successful!");
            })

            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;

                state.error =
                    action.payload?.message ||
                    "Login failed.";

                state.validationErrors =
                    action.payload?.errors || null;

                toast.error(state.error || "Login failed.");
            })

            /*
            |--------------------------------------------------------------------------
            | FETCH ME
            |--------------------------------------------------------------------------
            */

            .addCase(fetchMe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchMe.fulfilled, (state, action) => {
                state.loading = false;

                state.user = action.payload.user;
                state.role = action.payload.user?.role || null;

                state.isAuthenticated = true;

                state.error = null;
            })

            .addCase(fetchMe.rejected, (state, action) => {
                state.loading = false;

                state.user = null;
                state.role = null;
                state.isAuthenticated = false;

                /*
                 * 401 means unauthenticated according to backend guide.
                 */
                state.error =
                    action.payload?.status === 401
                        ? null
                        : action.payload?.message || null;
            })

            /*
            |--------------------------------------------------------------------------
            | LOGOUT
            |--------------------------------------------------------------------------
            */

            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;

                state.user = null;
                state.role = null;
                state.isAuthenticated = false;

                state.error = null;
                state.validationErrors = null;
            })

            .addCase(logoutUser.rejected, (state, action) => {
                /*
                 * Even if logout request fails,
                 * frontend should clear its authentication state.
                 */
                state.loading = false;

                state.user = null;
                state.role = null;
                state.isAuthenticated = false;

                state.error =
                    action.payload?.message || null;
            })

            /*
            |--------------------------------------------------------------------------
            | FORGOT PASSWORD
            |--------------------------------------------------------------------------
            */

            .addCase(forgotUserPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.passwordResetMessage = null;
            })

            .addCase(forgotUserPassword.fulfilled, (state, action) => {
                state.loading = false;

                state.passwordResetMessage =
                    action.payload.message;

                state.error = null;

                toast.success(action.payload.message || "Password reset email sent.");
            })

            .addCase(forgotUserPassword.rejected, (state, action) => {
                state.loading = false;

                state.error =
                    action.payload?.message ||
                    "Unable to process password reset request.";

                toast.error(state.error);
            })

            /*
            |--------------------------------------------------------------------------
            | RESET PASSWORD
            |--------------------------------------------------------------------------
            */

            .addCase(resetUserPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(resetUserPassword.fulfilled, (state, action) => {
                state.loading = false;

                state.passwordResetMessage =
                    action.payload.message;

                state.error = null;

                toast.success(action.payload.message || "Password reset successful!");
            })

            .addCase(resetUserPassword.rejected, (state, action) => {
                state.loading = false;

                state.error =
                    action.payload?.message ||
                    "Unable to reset password.";

                toast.error(state.error);
            });
    },
});

export const {
    clearAuthError,
    clearPasswordResetMessage,
    updateUser,
} = authSlice.actions;

export default authSlice.reducer;