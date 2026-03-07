import { useEffect, useState } from "react";
import { profileApi } from "@/features/profile/api/api";
import type { UserProfile } from "@/features/profile/types/profile.types";
import { getAvatarText } from "@/features/profile/utils/avatar.utils";
import ImageViewer from "@/components/img/ImageViewer";
import { useParams } from "react-router-dom";

export default function ViewProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  //////////////////////////////////////////////////
  // Fetch Profile
  //////////////////////////////////////////////////
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const res = await profileApi.getPublicProfile(userId);
        setProfile(res.data.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  if (!profile) return null;

  const displayName = profile.username ?? profile.email ?? "";

  const handleMessage = () => {
    console.log("open chat with", profile.id);
  };

  return (
    <div className="flex flex-col h-full bg-app">
      {/* Bottom Action */}
      <div className="profile-action-bar">
        <button className="w-full h-12 btn btn-primary" onClick={handleMessage}>
          Message
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">
          {profile.avatarUrl ? (
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

          <div className="text-center">
            <h2 className="text-primary font-semibold">
              @{profile.username || profile.email.split("@")[0]}
            </h2>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-soft rounded-2xl p-4 space-y-2">
          <p className="text-sm text-muted">Bio</p>
          <p className="text-primary whitespace-pre-line">
            {profile.bio || "No bio yet."}
          </p>
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
