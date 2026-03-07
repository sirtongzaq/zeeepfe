import { profileApi } from "@/features/profile/api/api";
import type { SearchUser } from "@/features/profile/types/profile.types";
import { getAvatarText } from "@/features/profile/utils/avatar.utils";
import { useDebounce } from "@/features/profile/utils/useDebounce.utils";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchUser() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedKeyword = useDebounce(keyword, 400);

  useEffect(() => {
    if (!debouncedKeyword.trim()) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);

        const res = await profileApi.searchUsers(debouncedKeyword);
        setUsers(res.data.data.data);
      } catch (err) {
        console.error(err);
        setUsers([]);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    };

    fetchUsers();
  }, [debouncedKeyword]);

  const handleClickUser = (id: string) => {
    if (id === currentUser?.id) {
      navigate("/profile");
      return;
    }

    navigate(`/profile/${id}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);

    if (!value.trim()) {
      setUsers([]);
    }
  };

  return (
    <div className="addfriend-container">
      <div className="addfriend-card">
        {/* SEARCH */}
        <div className="addfriend-input-group relative">
          <input
            type="text"
            placeholder="@Username / Email"
            value={keyword}
            onChange={handleChange}
            className="input-clean addfriend-input pr-10"
          />

          {loading && (
            <div className="input-spinner">
              <div className="i-spinner" />
            </div>
          )}
        </div>

        <div>
          {/* EMPTY */}
          {!loading && keyword.trim() && users.length === 0 && (
            <p className="text-sm text-muted text-center">No users found</p>
          )}

          {/* USERS */}
          {!loading &&
            users.map((user) => (
              <div
                key={user.id}
                className="chat-list-item"
                onClick={() => handleClickUser(user.id)}
              >
                <div className="chat-avatar">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="avatar" />
                  ) : (
                    getAvatarText(user.username ?? user.email ?? "")
                  )}
                </div>

                <div className="chat-info">
                  <div className="chat-name">{user.username || user.email}</div>

                  {user.bio && (
                    <div className="text-sm text-secondary">{user.bio}</div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
