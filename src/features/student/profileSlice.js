import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { getApiError } from "../../utils/api";
import {
    getStudentProfile,
    updateStudentProfile,
} from "../../api/studentApi";
import { uploadImage } from "../../utils/upload";

/*
|--------------------------------------------------------------------------
| Thunks
|--------------------------------------------------------------------------
*/

export const fetchProfile = createAsyncThunk(
    "studentProfile/fetch",

    async (_, { rejectWithValue }) => {
        try {
            const response = await getStudentProfile();

            return {
                student: response.data.student,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const saveProfile = createAsyncThunk(
    "studentProfile/update",

    async (data, { rejectWithValue }) => {
        try {
            const response = await updateStudentProfile(data);

            return response.data;
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

/*
| Photo ko baaki form fields se alag rakhna zaroori hai — admin flow me photo
| turant save ho jaata hai. Student me bhi wahi behaviour chahiye, warna photo
| upload hone ke baad bhi user ko "Save Changes" dabaana padta hai aur Cancel
| karne par file orphan ho jaati hai.
|
| Upload aur save dono is thunk me hain taaki ek hi loading/error state dono
| steps ko cover kare.
*/
export const saveProfilePhoto = createAsyncThunk(
    "studentProfile/updatePhoto",

    async (file, { rejectWithValue }) => {
        try {
            const url = await uploadImage(file);
            const response = await updateStudentProfile({ profile_image: url });

            return response.data;
        } catch (error) {
            // `uploadImage` already friendly Error throw karta hai, wo axios
            // error nahi hai — uska message seedha use karo.
            return rejectWithValue(
                error.response
                    ? getApiError(error)
                    : { status: null, message: error.message, errors: null },
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/

const profileSlice = createSlice({
    name: "studentProfile",

    initialState: {
        profile: null,

        loading: false,

        saving: false,

        uploadingPhoto: false,

        error: null,
        validationErrors: null,
    },

    reducers: {
        clearProfileError: (state) => {
            state.error = null;
            state.validationErrors = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload.student;
            })

            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            })

            .addCase(saveProfile.pending, (state) => {
                state.saving = true;
                state.error = null;
                state.validationErrors = null;
            })

            .addCase(saveProfile.fulfilled, (state, action) => {
                state.saving = false;
                state.profile = action.payload.student;
                toast.success(action.payload.message || "Profile updated successfully");
            })

            .addCase(saveProfile.rejected, (state, action) => {
                state.saving = false;

                state.error = action.payload?.message || null;
                state.validationErrors = action.payload?.errors || null;
                toast.error(action.payload?.message || "Failed to update profile.");
            })

            .addCase(saveProfilePhoto.pending, (state) => {
                state.uploadingPhoto = true;
                state.error = null;
            })

            .addCase(saveProfilePhoto.fulfilled, (state, action) => {
                state.uploadingPhoto = false;
                // `student` fresh aata hai aur usme `user` relation bhi hota
                // hai, isliye header avatar bhi turant update ho jaata hai.
                state.profile = action.payload.student;
                toast.success("Profile photo updated!");
            })

            .addCase(saveProfilePhoto.rejected, (state, action) => {
                state.uploadingPhoto = false;
                state.error = action.payload?.message || null;
                toast.error(action.payload?.message || "Failed to update photo.");
            });
    },
});

export const { clearProfileError } = profileSlice.actions;

export default profileSlice.reducer;
