import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

import { loginUser } from "../../features/auth/authSlice";
import { AuthCard, AuthField } from "../../components/auth";
import { Input } from "../../components/ui/Field";
import Button from "../../components/ui/Button";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { loading, validationErrors } = useSelector((state) => state.auth);

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
        <AuthCard title="Welcome back" subtitle="Log in to continue your coursework.">
            <form onSubmit={handleSubmit} className="space-y-5">
                <AuthField id="email" label="Email" error={validationErrors?.email?.[0]}>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        invalid={Boolean(validationErrors?.email?.[0])}
                        placeholder="you@school.edu"
                    />
                </AuthField>

                <AuthField id="password" label="Password" error={validationErrors?.password?.[0]}>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        invalid={Boolean(validationErrors?.password?.[0])}
                        placeholder="••••••••"
                    />
                </AuthField>

                <div className="flex justify-end">
                    <Link to="/forgot-password" className="text-xs font-medium text-accent transition-colors hover:text-accent-bright">
                        Forgot password?
                    </Link>
                </div>

                <Button type="submit" size="lg" fullWidth loading={loading} loadingText="Logging in…">
                    <LogIn size={16} />
                    Log in
                </Button>
            </form>

            <p className="pt-2 text-center text-sm text-muted">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="font-semibold text-accent transition-colors hover:text-accent-bright">
                    Register
                </Link>
            </p>
        </AuthCard>
    );
};

export default Login;
