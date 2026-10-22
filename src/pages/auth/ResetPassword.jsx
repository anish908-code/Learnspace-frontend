import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { RotateCcw } from "lucide-react";

import {
    clearPasswordResetMessage,
    resetUserPassword,
} from "../../features/auth/authSlice";
import { AuthCard, AuthField } from "../../components/auth";
import { Input } from "../../components/ui/Field";
import Button, { ButtonLink } from "../../components/ui/Button";
import { AlertBanner } from "../../components/common";

const ResetPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const { loading, error } = useSelector((state) => state.auth);

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
        <AuthCard title="Set a new password" subtitle="Choose something you haven't used before.">
            {isLinkInvalid ? (
                <>
                    <AlertBanner
                        type="error"
                        message="This password reset link is invalid or has expired. Please request a new one."
                    />

                    <ButtonLink to="/forgot-password" size="lg" fullWidth>
                        Request new link
                    </ButtonLink>
                </>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <AlertBanner type="error" message={error} />

                    <AuthField id="password" label="New password">
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter new password"
                        />
                    </AuthField>

                    <AuthField id="password_confirmation" label="Confirm new password">
                        <Input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            required
                            placeholder="Repeat the new password"
                        />
                    </AuthField>

                    <Button type="submit" size="lg" fullWidth loading={loading} loadingText="Updating…">
                        <RotateCcw size={16} />
                        Update password
                    </Button>
                </form>
            )}

            <p className="pt-2 text-center text-sm text-muted">
                <Link to="/login" className="font-semibold text-accent transition-colors hover:text-accent-bright">
                    Back to log in
                </Link>
            </p>
        </AuthCard>
    );
};

export default ResetPassword;
