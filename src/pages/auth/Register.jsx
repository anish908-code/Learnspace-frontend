import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

import { registerUser } from "../../features/auth/authSlice";
import { AuthCard, AuthField } from "../../components/auth";
import { Input } from "../../components/ui/Field";
import Button from "../../components/ui/Button";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, validationErrors } = useSelector((state) => state.auth);

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
        <AuthCard title="Create account" subtitle="Student is the default role. It takes a minute.">
            <form onSubmit={handleSubmit} className="space-y-5">
                <AuthField id="name" label="Full name" error={validationErrors?.name?.[0]}>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        invalid={Boolean(validationErrors?.name?.[0])}
                        placeholder="Name of User"
                    />
                </AuthField>

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
                        placeholder="Create a password"
                    />
                </AuthField>

                <AuthField id="password_confirmation" label="Confirm password">
                    <Input
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        required
                        placeholder="Repeat the password"
                    />
                </AuthField>

                <Button type="submit" size="lg" fullWidth loading={loading} loadingText="Creating account…">
                    <UserPlus size={16} />
                    Create account
                </Button>
            </form>

            <p className="pt-2 text-center text-sm text-muted">
                Already registered?{" "}
                <Link to="/login" className="font-semibold text-accent transition-colors hover:text-accent-bright">
                    Log in
                </Link>
            </p>
        </AuthCard>
    );
};

export default Register;
