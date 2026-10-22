import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Pencil, Mail, BadgeCheck, Camera } from "lucide-react";

import {
    fetchProfile,
    saveProfile,
    saveProfilePhoto,
    clearProfileError,
} from "../../features/student/profileSlice";
import Avatar from "../../components/common/Avatar";
import { PageHeader, AlertBanner } from "../../components/common";
import { Skeleton, SkeletonLine } from "../../components/common/Skeleton";
import Button from "../../components/ui/Button";
import { Field, Input, Textarea } from "../../components/ui/Field";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import { SectionMarker } from "../../components/ui/Deco";
import { cn } from "../../utils/cn";

function ProfileForm({ profile, saving, uploadingPhoto, validationErrors, onSave, onCancel }) {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        college: profile.college || "",
        course: profile.course || "",
        semester: profile.semester || "",
        bio: profile.bio || "",
        skills: profile.skills || "",
    });
    const [thumbError, setThumbError] = useState(null);

    const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    // Photo turant save hoti hai (admin flow jaisa) — isliye ye form state me
    // nahi jaati, warna "Save Changes" purani photo wapas likh dega.
    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        // Value reset karo warna same file dobara choose karne par onChange
        // fire hi nahi hota aur upload "kaam nahi karta" lagta hai.
        e.target.value = "";
        if (!file) return;

        setThumbError(null);
        const result = await dispatch(saveProfilePhoto(file));

        if (saveProfilePhoto.rejected.match(result)) {
            setThumbError(result.payload?.message || "Upload failed. Try again.");
        }
    };

    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <div className="card p-6 sm:p-7">
            <SectionMarker index={1}>Edit Profile</SectionMarker>
            <h2 className="mt-3 font-display text-xl font-bold text-fg">Edit Profile</h2>
            <p className="mt-1.5 text-sm text-muted">Update your details and save.</p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <Field label="Profile Photo" error={thumbError}>
                    <div className="flex items-center gap-4">
                        <div className="group relative shrink-0">
                            <Avatar
                                name={profile.user?.name}
                                src={profile.profile_image}
                                className="h-20 w-20 text-base"
                            />

                            <label
                                className={cn(
                                    "absolute inset-0 flex cursor-pointer items-center justify-center rounded-full",
                                    "bg-fg/65 text-white opacity-100 transition-opacity duration-200",
                                    "sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100",
                                )}
                            >
                                {uploadingPhoto ? <Spinner label="Uploading" /> : <Camera size={18} />}
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    onChange={handleImageChange}
                                    disabled={uploadingPhoto}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <p className="min-w-0 text-xs text-muted">
                            {uploadingPhoto ? "Uploading..." : "Click on photo to change"}
                        </p>
                    </div>
                </Field>

                <div className="rule-line" />

                <div className="grid gap-5 sm:grid-cols-2">
                    {[
                        { id: "college", label: "College", placeholder: "Your college name" },
                        { id: "course", label: "Course / Branch", placeholder: "e.g. B.Tech CSE" },
                    ].map((field) => (
                        <Field
                            key={field.id}
                            label={field.label}
                            htmlFor={field.id}
                            error={validationErrors?.[field.id] && validationErrors[field.id][0]}
                        >
                            <Input
                                id={field.id}
                                name={field.id}
                                type="text"
                                value={formData[field.id]}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                invalid={Boolean(validationErrors?.[field.id])}
                            />
                        </Field>
                    ))}
                </div>

                <Field
                    label="Semester"
                    htmlFor="semester"
                    error={validationErrors?.semester && validationErrors.semester[0]}
                >
                    <Input
                        id="semester"
                        name="semester"
                        type="text"
                        value={formData.semester}
                        onChange={handleChange}
                        placeholder="e.g. 5th"
                        invalid={Boolean(validationErrors?.semester)}
                    />
                </Field>

                <Field label="Skills" htmlFor="skills">
                    <Input
                        id="skills"
                        name="skills"
                        type="text"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="e.g. React, PHP, MySQL"
                    />
                </Field>

                <Field label="Bio" htmlFor="bio">
                    <Textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself..."
                        className="resize-none"
                    />
                </Field>

                <div className="flex flex-wrap gap-3 pt-2">
                    <Button type="submit" loading={saving} loadingText="Saving...">
                        Save Changes
                    </Button>
                    <Button type="button" onClick={onCancel} disabled={saving} variant="secondary">
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}

function AccountPanel({ profile }) {
    return (
        <aside className="card h-fit p-6 sm:p-7">
            <SectionMarker index={2}>Account</SectionMarker>

            <div className="mt-6 flex flex-col items-center text-center">
                <Avatar
                    name={profile.user?.name}
                    src={profile.profile_image}
                    className="h-24 w-24 text-xl shadow-lift"
                />

                <h3 className="mt-4 break-words font-display text-lg font-bold text-fg">
                    {profile.user?.name || "Student"}
                </h3>

                <Badge tone="teal" dot className="mt-3">
                    Student
                </Badge>
            </div>

            <div className="rule-line my-6" />

            <dl className="space-y-4">
                <div className="min-w-0">
                    <dt className="technical-label flex items-center gap-1.5">
                        <Mail size={13} strokeWidth={2.2} aria-hidden="true" className="text-accent" />
                        Email
                    </dt>
                    <dd className="mt-1.5 break-words text-sm font-medium text-fg">
                        {profile.user?.email || "-"}
                    </dd>
                </div>

                <div className="min-w-0">
                    <dt className="technical-label flex items-center gap-1.5">
                        <BadgeCheck size={13} strokeWidth={2.2} aria-hidden="true" className="text-accent" />
                        Role
                    </dt>
                    <dd className="mt-1.5 break-words text-sm font-medium text-fg">Student</dd>
                </div>
            </dl>
        </aside>
    );
}

const Profile = () => {
    const dispatch = useDispatch();
    const { profile, loading, saving, uploadingPhoto, validationErrors } = useSelector((state) => state.studentProfile);
    const [mode, setMode] = useState("view");

    useEffect(() => { dispatch(fetchProfile()); return () => { dispatch(clearProfileError()); }; }, [dispatch]);

    if (loading && !profile) {
        return (
            <div className="mx-auto max-w-6xl">
                <PageHeader
                    eyebrow="account"
                    title="My Profile"
                    subtitle="View and manage your information."
                />

                <div className="grid gap-5 lg:grid-cols-3">
                    <div className="card p-6 sm:p-7 lg:col-span-2">
                        <div className="flex flex-col items-center text-center">
                            <Skeleton className="h-24 w-24 rounded-full" />
                            <SkeletonLine className="mt-5 h-5 w-40" />
                            <SkeletonLine className="mt-3 h-4 w-24" />
                        </div>

                        <div className="mt-7 grid gap-4 sm:grid-cols-2">
                            {[1, 2, 3, 4].map((n) => (
                                <div key={n} className="surface-b rounded-2xl px-4 py-3">
                                    <SkeletonLine className="h-3 w-20" />
                                    <SkeletonLine className="mt-2.5 h-3.5 w-36" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card p-6 sm:p-7">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <SkeletonLine className="mt-5 h-4 w-32" />
                        <div className="mt-6 space-y-4">
                            <SkeletonLine className="h-3 w-20" />
                            <SkeletonLine className="h-3.5 w-44" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) return <AlertBanner type="error" message="Failed to load profile." />;

    const handleSave = async (data) => { const result = await dispatch(saveProfile(data)); if (saveProfile.fulfilled.match(result)) setMode("view"); };

    const infoFields = [
        { label: "College", value: profile.college },
        { label: "Course / Branch", value: profile.course },
        { label: "Semester", value: profile.semester },
        { label: "Skills", value: profile.skills },
    ].filter((f) => f.value && String(f.value).trim() !== "");

    const hasBio = profile.bio && String(profile.bio).trim() !== "";
    const hasAnyInfo = infoFields.length > 0 || hasBio;

    return (
        <div className="mx-auto max-w-6xl">
            <PageHeader
                eyebrow="account"
                title="My Profile"
                subtitle="View and manage your information."
                action={
                    mode === "view" ? (
                        <Button type="button" onClick={() => setMode("edit")}>
                            <Pencil size={15} />
                            Edit
                        </Button>
                    ) : null
                }
            />

            <div className="grid items-start gap-5 lg:grid-cols-3">
                {mode === "edit" ? (
                    <div className="lg:col-span-2">
                        <ProfileForm
                            profile={profile}
                            saving={saving}
                            uploadingPhoto={uploadingPhoto}
                            validationErrors={validationErrors}
                            onSave={handleSave}
                            onCancel={() => setMode("view")}
                        />
                    </div>
                ) : (
                    <section className="card p-6 sm:p-7 lg:col-span-2">
                        <SectionMarker index={1}>Details</SectionMarker>

                        {hasAnyInfo ? (
                            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                                {infoFields.map((field) => (
                                    <div key={field.label} className="surface-b min-w-0 rounded-2xl px-4 py-3.5">
                                        <dt className="technical-label">{field.label}</dt>
                                        <dd className="mt-1.5 break-words text-sm font-medium text-fg">
                                            {field.value}
                                        </dd>
                                    </div>
                                ))}

                                {hasBio && (
                                    <div className="surface-b min-w-0 rounded-2xl px-4 py-3.5 sm:col-span-2">
                                        <dt className="technical-label">Bio</dt>
                                        <dd className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-fg">
                                            {profile.bio}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        ) : (
                            <div className="mt-6 rounded-2xl border border-dashed border-line-strong px-6 py-12 text-center">
                                <p className="text-sm text-muted">
                                    No details added yet.{" "}
                                    <span className="font-medium text-accent">Edit</span> to add your
                                    college, skills and bio.
                                </p>
                            </div>
                        )}
                    </section>
                )}

                <AccountPanel profile={profile} />
            </div>
        </div>
    );
};

export default Profile;
