import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { loginUser } from "../../features/auth/authSlice";
import { AuthCard, AuthField } from "../../components/auth";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { loading, validationErrors } = useSelector(
        (state) => state.auth
    );

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(loginUser(formData));

        if (loginUser.fulfilled.match(result)) {
            const role = result.payload.role;
            const from = location.state?.from?.pathname;
            if (from) {
                navigate(from, { replace: true });
            } else if (role === "student") {
                navigate("/student", { replace: true });
            } else if (role === "admin") {
                navigate("/admin", { replace: true });
            }
        }
    };

    return (
        <AuthCard title="Welcome Back" subtitle="Login to your LearnSpace account">
            <form onSubmit={handleSubmit} className="space-y-5">
                <AuthField id="email" label="Email" error={validationErrors?.email?.[0]}>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="Enter your email"
                    />
                </AuthField>

                <AuthField id="password" label="Password" error={validationErrors?.password?.[0]}>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="Enter your password"
                    />
                </AuthField>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-sm font-medium transition hover:underline"
                        style={{ color: "var(--accent)" }}
                    >
                        Forgot Password?
                    </button>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            <p className="mt-5 text-center text-sm font-medium" style={{ color: "var(--foreground)" }}>
                Don&apos;t have an account?{" "}
                <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="font-semibold transition hover:underline"
                    style={{ color: "var(--accent)" }}
                >
                    Register
                </button>
            </p>
        </AuthCard>
    );
};

export default Login;
