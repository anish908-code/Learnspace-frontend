import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { getApiError } from "../../utils/api";
import {
    getCertificates,
    generateCertificate,
    deleteCertificate,
} from "../../api/adminApi";

export const fetchAdminCertificates = createAsyncThunk(
    "adminCertificates/fetchAll",

    async (_, { rejectWithValue }) => {
        try {
            const response = await getCertificates();

            return {
                certificates: response.data.certificates,
                meta: response.data.meta,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const issueCertificate = createAsyncThunk(
    "adminCertificates/generate",

    async (data, { rejectWithValue }) => {
        try {
            const response = await generateCertificate(data);

            return {
                message: response.data.message,
                certificate: response.data.certificate,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

export const removeCertificate = createAsyncThunk(
    "adminCertificates/remove",

    async (id, { rejectWithValue }) => {
        try {
            const response = await deleteCertificate(id);

            return {
                message: response.data.message,
                id,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

const adminCertificateSlice = createSlice({
    name: "adminCertificates",

    initialState: {
        certificates: [],
        meta: null,

        loading: false,
        saving: false,
        deleting: false,
        successMessage: null,
        error: null,
    },

    reducers: {
        clearAdminCertificateFeedback: (state) => {
            state.successMessage = null;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchAdminCertificates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchAdminCertificates.fulfilled, (state, action) => {
                state.loading = false;
                state.certificates = action.payload.certificates;
                state.meta = action.payload.meta;
            })

            .addCase(fetchAdminCertificates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            })

            .addCase(issueCertificate.pending, (state) => {
                state.saving = true;
                state.successMessage = null;
                state.error = null;
            })

            .addCase(issueCertificate.fulfilled, (state, action) => {
                state.saving = false;
                state.successMessage = action.payload.message;
                toast.success("Certificate issued successfully");

                const exists = state.certificates.some(
                    (certificate) =>
                        certificate.id === action.payload.certificate.id
                );

                if (!exists) {
                    state.certificates.unshift(action.payload.certificate);
                }
            })

            .addCase(issueCertificate.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload?.message || null;
                toast.error(action.payload?.message || "Failed to issue certificate.");
            })

            .addCase(removeCertificate.pending, (state) => {
                state.deleting = true;
                state.successMessage = null;
                state.error = null;
            })

            .addCase(removeCertificate.fulfilled, (state, action) => {
                state.deleting = false;
                state.successMessage = action.payload.message;
                state.certificates = state.certificates.filter(
                    (certificate) => certificate.id !== action.payload.id
                );
                toast.success("Certificate deleted successfully");
            })

            .addCase(removeCertificate.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.payload?.message || null;
                toast.error(action.payload?.message || "Failed to delete certificate.");
            });
    },
});

export const { clearAdminCertificateFeedback } =
    adminCertificateSlice.actions;

export default adminCertificateSlice.reducer;
