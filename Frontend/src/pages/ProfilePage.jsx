import { useState, useEffect } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { CameraIcon, LoaderIcon, MapPinIcon, ShuffleIcon, UserIcon, GlobeIcon, BookOpenIcon, SaveIcon } from "lucide-react";
import { LANGUAGES } from "../constants";

const ProfilePage = () => {
    const { authUser } = useAuthUser();
    const queryClient = useQueryClient();

    const [formState, setFormState] = useState({
        fullName: "",
        bio: "",
        nativeLanguage: "",
        learningLanguage: "",
        location: "",
        profilePic: "",
        gender: "",
    });

    useEffect(() => {
        if (authUser) {
            setFormState({
                fullName: authUser.fullName || "",
                bio: authUser.bio || "",
                nativeLanguage: authUser.nativeLanguage || "",
                learningLanguage: authUser.learningLanguage || "",
                location: authUser.location || "",
                profilePic: authUser.profilePic || "",
                gender: authUser.gender || "",
            });
        }
    }, [authUser]);

    const { mutate: updateProfileMutation, isPending } = useMutation({
        mutationFn: completeOnboarding, // Reusing the onboarding endpoint which is a generic update
        onSuccess: () => {
            toast.success("Profile updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfileMutation(formState);
    };

    const handleRandomAvatar = () => {
        const idx = Math.floor(Math.random() * 50) + 1;
        const gender = formState.gender || "other";

        const randomAvatar = gender === "male"
            ? `https://avatar.iran.liara.run/public/boy?username=${formState.fullName.split(" ")[0]}${idx}`
            : gender === "female"
                ? `https://avatar.iran.liara.run/public/girl?username=${formState.fullName.split(" ")[0]}${idx}`
                : `https://avatar.iran.liara.run/public/${idx}`;

        setFormState({ ...formState, profilePic: randomAvatar });
        toast.success(`New ${gender} avatar generated!`);
    };


    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
            <div className="card bg-base-200/50 backdrop-blur-xl border border-base-300 shadow-xl overflow-hidden">
                {/* Profile Header Decoration */}
                <div className="h-24 sm:h-32 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30" />

                <div className="card-body p-4 sm:p-6 lg:p-10 -mt-12 sm:-mt-16">
                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                        {/* Profile Pic */}
                        <div className="relative group">
                            <div className="size-32 rounded-3xl bg-base-300 ring-4 ring-base-200 overflow-hidden shadow-2xl">
                                {formState.profilePic ? (
                                    <img src={formState.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <UserIcon className="size-12 opacity-20" />
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={handleRandomAvatar}
                                className="absolute -bottom-2 -right-2 btn btn-primary btn-circle btn-sm shadow-xl"
                            >
                                <ShuffleIcon className="size-4" />
                            </button>
                        </div>

                        <div className="text-center sm:text-left pt-4">
                            <h1 className="text-3xl font-black">{authUser?.fullName}</h1>
                            <p className="opacity-60 flex items-center justify-center sm:justify-start gap-1 mt-1 font-medium">
                                <MapPinIcon className="size-4" />
                                {authUser?.location || "No location set"}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* FULL NAME */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold opacity-70 uppercase tracking-widest text-xs">Full Name</span>
                                </label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 opacity-40" />
                                    <input
                                        type="text"
                                        value={formState.fullName}
                                        onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                                        className="input input-bordered w-full pl-10 bg-base-100/50 focus:bg-base-100 transition-colors"
                                        placeholder="Your full name"
                                    />
                                </div>
                            </div>

                            {/* LOCATION */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold opacity-70 uppercase tracking-widest text-xs">Location</span>
                                </label>
                                <div className="relative">
                                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 opacity-40" />
                                    <input
                                        type="text"
                                        value={formState.location}
                                        onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                                        className="input input-bordered w-full pl-10 bg-base-100/50 focus:bg-base-100 transition-colors"
                                        placeholder="City, Country"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* BIO */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold opacity-70 uppercase tracking-widest text-xs">Bio</span>
                            </label>
                            <textarea
                                value={formState.bio}
                                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                                className="textarea textarea-bordered h-28 bg-base-100/50 focus:bg-base-100 transition-colors leading-relaxed"
                                placeholder="Share your language journey..."
                            />
                        </div>

                        {/* GENDER SELECTION */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold opacity-70 uppercase tracking-widest text-xs">Gender</span>
                            </label>
                            <div className="flex gap-8 px-2">
                                <label className="label cursor-pointer flex gap-3 p-0">
                                    <input
                                        type="radio"
                                        name="gender"
                                        className="radio radio-primary radio-md"
                                        value="male"
                                        checked={formState.gender === "male"}
                                        onChange={(e) => setFormState({ ...formState, gender: e.target.value })}
                                    />
                                    <span className="label-text font-medium">Male</span>
                                </label>
                                <label className="label cursor-pointer flex gap-3 p-0">
                                    <input
                                        type="radio"
                                        name="gender"
                                        className="radio radio-primary radio-md"
                                        value="female"
                                        checked={formState.gender === "female"}
                                        onChange={(e) => setFormState({ ...formState, gender: e.target.value })}
                                    />
                                    <span className="label-text font-medium">Female</span>
                                </label>
                                <label className="label cursor-pointer flex gap-3 p-0">
                                    <input
                                        type="radio"
                                        name="gender"
                                        className="radio radio-primary radio-md"
                                        value="other"
                                        checked={formState.gender === "other"}
                                        onChange={(e) => setFormState({ ...formState, gender: e.target.value })}
                                    />
                                    <span className="label-text font-medium">Other</span>
                                </label>
                            </div>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* NATIVE LANGUAGE */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold opacity-70 uppercase tracking-widest text-xs flex items-center gap-2">
                                        <GlobeIcon className="size-3" /> Native Language
                                    </span>
                                </label>
                                <select
                                    value={formState.nativeLanguage}
                                    onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                                    className="select select-bordered w-full bg-base-100/50"
                                >
                                    <option value="">Select Language</option>
                                    {LANGUAGES.map((lang) => (
                                        <option key={`native-${lang}`} value={lang.toLowerCase()}>
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* LEARNING LANGUAGE */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold opacity-70 uppercase tracking-widest text-xs flex items-center gap-2">
                                        <BookOpenIcon className="size-3" /> Learning Language
                                    </span>
                                </label>
                                <select
                                    value={formState.learningLanguage}
                                    onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                                    className="select select-bordered w-full bg-base-100/50"
                                >
                                    <option value="">Select Language</option>
                                    {LANGUAGES.map((lang) => (
                                        <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full shadow-lg shadow-primary/20 mt-4 transition-all hover:scale-[1.01]"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <LoaderIcon className="animate-spin size-5 mr-2" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <SaveIcon className="size-5 mr-2" />
                                    Save Profile Changes
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
