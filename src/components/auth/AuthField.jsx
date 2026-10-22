import { Field } from "../ui/Field";

/*
|--------------------------------------------------------------------------
| AuthField
|--------------------------------------------------------------------------
| Auth pages ka field wrapper. Validation UI ek hi jagah se aati hai
| (ui/Field) — isliye yahan koi duplicate styling nahi.
*/

const AuthField = ({ id, label, error, children }) => (
    <Field label={label} htmlFor={id} error={error}>
        {children}
    </Field>
);

export default AuthField;
