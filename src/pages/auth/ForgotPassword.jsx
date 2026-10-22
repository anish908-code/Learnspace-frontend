import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

import {
    clearPasswordResetMessage,
    forgotUserPassword,
} from "../../features/auth/authSlice";
import { AuthCard, AuthField } from "../../components/auth";
import { Input } from "../../components/ui/Field";
import Button from "../../components/ui/Button";

const ForgotPassword = () => {
    const dispatch = useDispatch();

    const { loading, validationErrors, error } = useSelector((state) => state.auth);

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
            title="Reset your password"
            subtitle="We'll email you a link to set a new one."
            error={error}
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <AuthField id="email" label="Email" error={validationErrors?.email?.[0]}>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        invalid={Boolean(validationErrors?.email?.[0])}
                        placeholder="you@school.edu"
                    />
                </AuthField>

                <Button type="submit" size="lg" fullWidth loading={loading} loadingText="Sending link…">
                    <Mail size={16} />
                    Send reset link
                </Button>
            </form>

            <p className="pt-2 text-center text-sm text-muted">
                Remembered it?{" "}
                <Link to="/login" className="font-semibold text-accent transition-colors hover:text-accent-bright">
                    Back to log in
                </Link>
            </p>
        </AuthCard>
    );
};

export default ForgotPassword;
