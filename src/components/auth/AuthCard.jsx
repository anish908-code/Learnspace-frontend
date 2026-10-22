import AlertBanner from "../common/AlertBanner";
import { CornerBrackets } from "../ui/Deco";
import { StatusLabel } from "../ui/Badge";

/*
|--------------------------------------------------------------------------
| AuthCard
|--------------------------------------------------------------------------
| Auth page ka form frame. Centering/padding AuthLayout ka kaam hai — yahan
| sirf hierarchy: technical marker → title → card surface → form.
*/

const AuthCard = ({ title, subtitle, marker = "secure access", children, error, success }) => (
    <div className="w-full">
        <div className="mb-7">
            <StatusLabel>{marker}</StatusLabel>

            <h1 className="mt-4 font-display text-[1.75rem] font-bold leading-tight tracking-[-0.035em] text-fg sm:text-[2.125rem]">
                {title}
            </h1>

            {subtitle && <p className="mt-2.5 text-sm leading-relaxed text-muted">{subtitle}</p>}
        </div>

        <div className="surface-a relative rounded-2xl p-6 shadow-lift-md sm:p-8">
            <CornerBrackets />

            <div className="relative">
                {success && <AlertBanner type="success" message={success} />}
                {error && <AlertBanner type="error" message={error} />}
                {children}
            </div>
        </div>
    </div>
);

export default AuthCard;
