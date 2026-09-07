import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Pencil, Mail, BadgeCheck, Camera } from "lucide-react";

import { fetchProfile, saveProfile, clearProfileError } from "../../features/student/profileSlice";
import Avatar from "../../components/common/Avatar";
import { uploadImage } from "../../utils/upload";
import { Skeleton, SkeletonLine } from "../../components/common/Skeleton";

function ProfileForm({ profile, saving, validationErrors, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        college: profile.college || "",
        course: profile.course || "",
        semester: profile.semester || "",
        bio: profile.bio || "",
        skills: profile.skills || "",
        profile_image: profile.profile_image || "",
    });
    const [thumbUploading, setThumbUploading] = useState(false);
    const [thumbError, setThumbError] = useState(null);

    const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) { setThumbError("Please select an image file."); return; }
        setThumbUploading(true);
        setThumbError(null);
        try {
            const url = await uploadImage(file);
            setFormData((prev) => ({ ...prev, profile_image: url }));
        } catch (err) { setThumbError(err.message || "Upload failed"); }
        finally { setThumbUploading(false); }
    };

    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <div className="card p-6 sm:p-8">
            <h2 className="text-lg font-semibold" style={{ fontFamily: '"Playfair Display", Georgia, serif', color: "var(--foreground)" }}>Edit Profile</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>Update your details and save.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                    <label className="label-text">Profile Photo</label>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Avatar name={profile.user?.name} src={formData.profile_image} className="h-20 w-20 border-2 border-warm-border text-base" />
                            <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
                                {thumbUploading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Camera size={18} />}
                                <input type="file" accept="image/*" onChange={handleImageChange} disabled={thumbUploading} className="hidden" />
                            </label>
                        </div>
                        <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{thumbUploading ? "Uploading..." : "Click on photo to change"}</div>
                    </div>
                    {thumbError && <p className="mt-1 text-sm" style={{ color: "var(--error)" }}>{thumbError}</p>}
                    {validationErrors?.profile_image && <p className="mt-1 text-sm" style={{ color: "var(--error)" }}>{validationErrors.profile_image[0]}</p>}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    {[
                        { id: "college", label: "College", placeholder: "Your college name" },
                        { id: "course", label: "Course / Branch", placeholder: "e.g. B.Tech CSE" },
                    ].map((field) => (
                        <div key={field.id}>
                            <label htmlFor={field.id} className="label-text">{field.label}</label>
                            <input id={field.id} name={field.id} type="text" value={formData[field.id]} onChange={handleChange} placeholder={field.placeholder} className="input-field" />
                            {validationErrors?.[field.id] && <p className="mt-1 text-sm" style={{ color: "var(--error)" }}>{validationErrors[field.id][0]}</p>}
                        </div>
                    ))}
                </div>

                <div>
                    <label htmlFor="semester" className="label-text">Semester</label>
                    <input id="semester" name="semester" type="text" value={formData.semester} onChange={handleChange} placeholder="e.g. 5th" className="input-field" />
                    {validationErrors?.semester && <p className="mt-1 text-sm" style={{ color: "var(--error)" }}>{validationErrors.semester[0]}</p>}
                </div>

                <div>
                    <label htmlFor="skills" className="label-text">Skills</label>
                    <input id="skills" name="skills" type="text" value={formData.skills} onChange={handleChange} placeholder="e.g. React, PHP, MySQL" className="input-field" />
                </div>

                <div>
                    <label htmlFor="bio" className="label-text">Bio</label>
                    <textarea id="bio" name="bio" rows={4} value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself..." className="input-field resize-none" />
                </div>

                <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save Changes"}</button>
                    <button type="button" onClick={onCancel} disabled={saving} className="btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    );
}

const Profile = () => {
    const dispatch = useDispatch();
    const { profile, loading, saving, validationErrors } = useSelector((state) => state.studentProfile);
    const [mode, setMode] = useState("view");

    useEffect(() => { dispatch(fetchProfile()); return () => { dispatch(clearProfileError()); }; }, [dispatch]);

    if (loading && !profile) {
        return (
            <div className="mx-auto max-w-3xl">
                <div className="mb-6 flex items-center justify-between"><div><h1 className="page-title">My Profile</h1><p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>View and manage your information.</p></div></div>
                <div className="card overflow-hidden">
                    <Skeleton className="h-28 w-full" />
                    <div className="-mt-12 flex flex-col items-center px-6 pb-6 text-center">
                        <Skeleton className="h-24 w-24 rounded-full border-4 border-white" />
                        <SkeletonLine className="mt-4 h-5 w-40" />
                        <SkeletonLine className="mt-3 h-6 w-52" />
                    </div>
                    <div className="grid gap-4 p-6 sm:grid-cols-2">
                        {[1,2,3,4].map((n) => (<div key={n} className="rounded-md px-4 py-3" style={{ background: "var(--muted)" }}><SkeletonLine className="h-3 w-20" /><SkeletonLine className="mt-2.5 h-3.5 w-36" /></div>))}
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) return <div className="rounded-md px-4 py-3 text-sm" style={{ background: "var(--error-bg)", color: "var(--error)" }}>Failed to load profile.</div>;

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
        <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="page-title">My Profile</h1>
                    <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>View and manage your information.</p>
                </div>
                {mode === "view" && <button type="button" onClick={() => setMode("edit")} className="btn-primary"><Pencil size={15} /> Edit</button>}
            </div>

            {mode === "edit" ? (
                <ProfileForm profile={profile} saving={saving} validationErrors={validationErrors} onSave={handleSave} onCancel={() => setMode("view")} />
            ) : (
                <div className="card overflow-hidden">
                    <div className="h-28" style={{ background: "linear-gradient(135deg, var(--foreground) 0%, #3A3A3A 100%)" }} />
                    <div className="-mt-12 flex flex-col items-center px-6 pb-6 text-center">
                        <Avatar name={profile.user?.name} src={profile.profile_image} className="h-24 w-24 border-4 border-white text-xl shadow-card-md" />
                        <h2 className="mt-3 text-xl" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, color: "var(--foreground)" }}>{profile.user?.name || "Student"}</h2>
                        <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium" style={{ background: "var(--accent-muted)", color: "var(--accent)" }}>
                            <Mail size={13} /> {profile.user?.email || "-"}
                        </span>
                        <span className="mt-2 inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium" style={{ background: "var(--success-bg)", color: "var(--success)" }}>
                            <BadgeCheck size={13} /> Student
                        </span>
                    </div>

                    {hasAnyInfo ? (
                        <div className="grid gap-4 border-t p-6 sm:grid-cols-2" style={{ borderColor: "var(--border)" }}>
                            {infoFields.map((field) => (
                                <div key={field.label} className="rounded-md px-4 py-3" style={{ background: "var(--muted)" }}>
                                    <p className="section-label text-[10px]">{field.label}</p>
                                    <p className="mt-1 truncate text-sm font-medium" style={{ color: "var(--foreground)" }}>{field.value}</p>
                                </div>
                            ))}
                            {hasBio && (
                                <div className="rounded-md px-4 py-3 sm:col-span-2" style={{ background: "var(--muted)" }}>
                                    <p className="section-label text-[10px]">Bio</p>
                                    <p className="mt-1 whitespace-pre-wrap text-sm" style={{ color: "var(--foreground)" }}>{profile.bio}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="border-t px-6 py-10 text-center" style={{ borderColor: "var(--border)" }}>
                            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                                No details added yet. <span style={{ color: "var(--accent)" }} className="font-medium">Edit</span> to add your college, skills and bio.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Profile;
