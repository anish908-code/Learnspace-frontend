/*
 * Common helper: axios error ko normal shape me convert karta hai
 * taki saare slices same tarike se error handle kar sakein.
 */
export const getApiError = (error) => {
    return {
        status: error.response?.status ?? null,
        message:
            error.response?.data?.message ||
            "Something went wrong. Please try again.",
        errors: error.response?.data?.errors || null,
    };
};
