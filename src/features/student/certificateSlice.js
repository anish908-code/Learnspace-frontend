import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getApiError } from "../../utils/api";
import {
    getCertificates,
    getCertificateDetail,
} from "../../api/studentApi";

export const fetchCertificates = createAsyncThunk(
    "studentCertificates/fetchAll",

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

export const fetchCertificateDetail = createAsyncThunk(
    "studentCertificates/fetchDetail",

    async (id, { rejectWithValue }) => {
        try {
            const response = await getCertificateDetail(id);

            return {
                certificate: response.data.certificate,
            };
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

const certificateSlice = createSlice({
    name: "studentCertificates",

    initialState: {
        certificates: [],
        meta: null,
        currentCertificate: null,

        loading: false,
        error: null,
    },

    reducers: {
        clearCurrentCertificate: (state) => {
            state.currentCertificate = null;
        },
        clearCertificateError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchCertificates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchCertificates.fulfilled, (state, action) => {
                state.loading = false;
                state.certificates = action.payload.certificates;
                state.meta = action.payload.meta;
            })

            .addCase(fetchCertificates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            })

            .addCase(fetchCertificateDetail.pending, (state) => {
                state.loading = true;
                state.currentCertificate = null;
            })

            .addCase(fetchCertificateDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCertificate = action.payload.certificate;
            })

            .addCase(fetchCertificateDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || null;
            });
    },
});

export const { clearCurrentCertificate, clearCertificateError } =
    certificateSlice.actions;

export default certificateSlice.reducer;
