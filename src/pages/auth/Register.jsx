import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../../features/auth/authSlice";
import { AuthCard, AuthField } from "../../components/auth";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, validationErrors } = useSelector(
        (state) => state.auth
    );

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(registerUser(formData));

        if (registerUser.fulfilled.match(result)) {
            const role = result.payload.role;
            if (role === "student") {
                navigate("/student", { replace: true });
            } else if (role === "admin") {
                navigate("/admin", { replace: true });
            }
        }
    };

    return (
        <AuthCard title="Create Account" subtitle="Create your LearnSpace account">
            <form onSubmit={handleSubmit} className="space-y-5">
                <AuthField id="name" label="Name" error={validationErrors?.name?.[0]}>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your name"
                        className="input-field"
                    />
                </AuthField>

                <AuthField id="email" label="Email" error={validationErrors?.email?.[0]}>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                        className="input-field"
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
                        placeholder="Create a password"
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
                        placeholder="Confirm your password"
                        className="input-field"
                    />
                </AuthField>

                <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? "Creating Account..." : "Create Account"}
                </button>
            </form>
            <p className="mt-5 text-center text-sm font-medium" style={{ color: "var(--foreground)" }}>
                Already have an account?{" "}
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="font-semibold transition hover:underline"
                    style={{ color: "var(--accent)" }}
                >
                    Login
                </button>
            </p>
        </AuthCard>
    );
};

export default Register;
