import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    forgotUserPassword,
    clearPasswordResetMessage,
} from "../../features/auth/authSlice";
import { AuthCard, AuthField } from "../../components/auth";

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, validationErrors } =
        useSelector((state) => state.auth);

    const [email, setEmail] = useState("");

    useEffect(() => {
        return () => {
            dispatch(clearPasswordResetMessage());
        };
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(forgotUserPassword({ email }));
    };

    return (
        <AuthCard
            title="Forgot Password"
            subtitle="Enter your email to reset your password"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <AuthField id="email" label="Email" error={validationErrors?.email?.[0]}>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                        className="input-field"
                    />
                </AuthField>

                <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>
            </form>
            <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-5 w-full text-center text-sm font-medium transition hover:underline"
                style={{ color: "var(--foreground)" }}
            >
                Back to Login
            </button>
        </AuthCard>
    );
};

export default ForgotPassword;
