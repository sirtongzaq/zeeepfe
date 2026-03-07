import { useAuthStore } from "@/stores/authStore";
import { profileApi } from "./api/api";
import { useEffect, useRef, useState } from "react";
import type { UpdateProfilePayload, UserProfile } from "./types/profile.types";
import { getAvatarText } from "./utils/avatar.utils";
import { uploadAvatar } from "./utils/uploadAvatar.utils";
import ImageViewer from "@/components/img/ImageViewer";
import { Pencil } from "lucide-react";

export default function ProfilePage() {
  const token = useAuthStore((s) => s.accessToken);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    username: "",
    bio: "",
    avatarFile: null as File | null,
    avatarPreview: "",
  });

  //////////////////////////////////////////////////
  // Fetch Profile
  //////////////////////////////////////////////////
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileApi.getMyProfile();
        setProfile(res.data.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  if (!token) return null;
  if (!profile) return null;

  const displayName = profile.username ?? profile.email ?? "";

  const handleEdit = () => {
    if (!profile) return;

    setForm({
      username: profile.username ?? "",
      bio: profile.bio ?? "",
      avatarFile: null,
      avatarPreview: profile.avatarUrl ?? "",
    });

    setIsEditing(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      avatarFile: file,
      avatarPreview: URL.createObjectURL(file),
    }));
  };

  const handleSave = async () => {
    if (isSaving) return; // 🔥 กันกดซ้ำ

    try {
      setIsSaving(true);

      let avatarUrl = profile?.avatarUrl;

      if (form.avatarFile) {
        avatarUrl = await uploadAvatar(form.avatarFile);
      }

      const payload: UpdateProfilePayload = {
        username: form.username,
        bio: form.bio,
      };

      if (avatarUrl) {
        payload.avatarUrl = avatarUrl;
      }

      await profileApi.updateProfile(payload);

      const res = await profileApi.getMyProfile();
      setProfile(res.data.data);

      setIsEditing(false);
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-app">
      {/* Floating Action Bottom */}
      <div className="profile-action-bar">
        {isEditing ? (
          <>
            <button
              className={`w-full h-12 btn btn-primary ${
                isSaving ? "btn-loading" : ""
              }`}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "" : "Save Changes"}
            </button>

            <button
              className="w-full btn btn-ghost"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className="w-full h-12 btn btn-primary">
              Share Profile
            </button>

            <button className="w-full btn btn-outline" onClick={handleEdit}>
              Edit Profile
            </button>
          </>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {isEditing ? (
              <>
                <div
                  className="chat-avatar chat-avatar--lg cursor-pointer hover:opacity-80 transition"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {form.avatarPreview ? (
                    <img src={form.avatarPreview} alt="avatar preview" />
                  ) : profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="avatar" />
                  ) : (
                    getAvatarText(displayName)
                  )}
                </div>

                {/* Edit Icon */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-soft text-primary p-2 rounded-full shadow-md hover:scale-105 transition"
                >
                  <Pencil size={16} />
                </button>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </>
            ) : profile.avatarUrl ? (
              <ImageViewer src={profile.avatarUrl}>
                <div className="chat-avatar chat-avatar--lg cursor-pointer">
                  <img src={profile.avatarUrl} alt="avatar" />
                </div>
              </ImageViewer>
            ) : (
              <div className="chat-avatar chat-avatar--lg">
                {getAvatarText(displayName)}
              </div>
            )}
          </div>

          <div className="relative inline-block">
            {isEditing ? (
              <div className="relative w-full max-w-xs mx-auto">
                <input
                  type="text"
                  maxLength={50}
                  value={form.username}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, username: e.target.value }))
                  }
                  placeholder="@Username"
                  className="rounded-2xl text-primary input-clean w-full text-center"
                />

                <div
                  className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs pointer-events-none transition ${
                    form.username.length > 40
                      ? "text-warning"
                      : "text-muted opacity-60"
                  }`}
                >
                  {form.username.length}/50
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-primary font-semibold">
                  @{profile.username || profile.email.split("@")[0]}
                </h2>

                {!profile.username && (
                  <span className="badge badge-sm badge-warning">
                    Incomplete
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Bio Card */}
        <div className="bg-soft rounded-2xl p-4 space-y-2">
          {isEditing ? (
            <>
              <p className="text-sm text-muted">Bio</p>

              <div className="relative">
                <textarea
                  maxLength={255}
                  value={form.bio}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="Tell us about yourself..."
                  className="w-full h-48 p-4 pb-8 rounded-lg input-clean resize-none"
                />

                <span
                  className={`absolute bottom-3 right-4 text-xs transition pointer-events-none ${
                    form.bio.length > 240
                      ? "text-warning"
                      : "text-muted opacity-60"
                  }`}
                >
                  {form?.bio?.length ?? 0}/255
                </span>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-muted">Bio</p>
              <p className="text-primary whitespace-pre-line">
                {profile.bio || "No bio yet."}
              </p>
            </>
          )}
        </div>

        {/* Account Info */}
        <div className="bg-surface border border-app rounded-2xl">
          <div className="p-4">
            <p className="text-sm text-muted">User ID</p>
            <p className="font-mono text-primary text-sm break-all">
              {profile.id}
            </p>
          </div>

          <div className="p-4">
            <p className="text-sm text-muted">Email</p>
            <p className="text-primary text-sm">{profile.email}</p>
          </div>

          <div className="p-4">
            <p className="text-sm text-muted">Account Status</p>
            <span className="badge badge-md badge-success">Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
