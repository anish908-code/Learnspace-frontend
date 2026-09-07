import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
    resetUserPassword,
    clearPasswordResetMessage,
} from "../../features/auth/authSlice";
import { AuthCard, AuthField } from "../../components/auth";
import { AlertBanner } from "../../components/common";

const ResetPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const { loading } = useSelector(
        (state) => state.auth
    );

    const [formData, setFormData] = useState({
        password: "",
        password_confirmation: "",
    });

    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const isLinkInvalid = !token || !email;

    useEffect(() => {
        return () => {
            dispatch(clearPasswordResetMessage());
        };
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(
            resetUserPassword({
                token,
                email,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
            })
        );
        if (resetUserPassword.fulfilled.match(result)) {
            navigate("/login", { replace: true });
        }
    };

    return (
        <>
            <AuthCard
                title="Reset Password"
                subtitle="Create your new password"
            >
                {isLinkInvalid ? (
                    <>
                        <AlertBanner
                            type="error"
                            message="This password reset link is invalid or has expired. Please request a new one."
                        />
                        <button
                            type="button"
                            onClick={() => navigate("/forgot-password")}
                            className="btn-primary w-full"
                        >
                            Request New Link
                        </button>
                    </>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AuthField id="password" label="New Password">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter new password"
                                className="input-field"
                            />
                        </AuthField>

                        <AuthField id="password_confirmation" label="Confirm Password">
                            <input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                required
                                placeholder="Confirm new password"
                                className="input-field"
                            />
                        </AuthField>

                        <button type="submit" disabled={loading} className="btn-primary w-full">
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}
            </AuthCard>

            <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-6 w-full text-center text-sm font-medium transition hover:underline"
                style={{ color: "var(--accent)" }}
            >
                Back to Login
            </button>
        </>
    );
};

export default ResetPassword;
