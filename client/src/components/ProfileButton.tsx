import { useEffect, useState } from "react";
import "./ProfileButton.css";

interface ProfileButtonProps {
  currentUser: { token: string; userId: string; username: string } | null;
  onLogOut: ()=>void;
}

export default function ProfileButton({ currentUser, onLogOut }: ProfileButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [profileStats, setProfileStats] = useState<any>({wins:0,losses:0});

  const handleLogOut = () => {
    onLogOut();
  }

  const handleSetProfileUrl = async (newUrl: string) => {
    if (!newUrl.trim()) {
      setError("URL cannot be empty.");
      return;
    }
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/auth/profile/image", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.token}`,
        },
        body: JSON.stringify({ profileUrl: newUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update.");
      setProfileImageUrl(data.profileUrl ?? null);
      setSuccess(true);
      setInputValue("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message ?? "Failed to update profile URL.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser?.token) return;

    const fetchProfileStats = async () => {
      try {
        const res = await fetch("http://localhost:5001/auth/profile/stats", {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });
        const data = await res.json();
        setProfileStats(data.stats ?? null);
      } catch {}
    };

    const fetchProfileImage = async () => {
      try {
        const res = await fetch("http://localhost:5001/auth/profile/image", {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });
        const data = await res.json();
        setProfileImageUrl(data.profileUrl ?? null);
      } catch {}
    };

    fetchProfileStats();
    fetchProfileImage();
  }, [currentUser?.token]);

  const initials = currentUser?.username
    ? currentUser.username.slice(0, 1).toUpperCase()
    : null;

  return (
    <div className="profile-widget">
      <button
        className={`profile-toggle${open ? " profile-toggle--open" : ""}`}
        onClick={() => {
          setOpen((prev) => !prev);
          setError(null);
          setSuccess(false);
        }}
        title={open ? "Close profile" : "Profile settings"}
      >
        {initials ? (
          <span className="profile-avatar">{initials}</span>
        ) : (
          <span className="profile-avatar profile-avatar--icon">⚙</span>
        )}
      </button>

      {open && (
        <div className="profile-panel">
          <div className="profile-header">
            <div className="profile-header-left">
              <span className="profile-header-label">Signed in as</span>
              <span className="profile-header-name">
                {currentUser?.username ?? "—"}
              </span>
            </div>
            {profileImageUrl && (
              <img
                className="profile-header-avatar"
                src={profileImageUrl}
                alt="Profile"
              />
            )}
            {profileStats && (
              <span className="profile-header-name">
                {profileStats.wins}W {profileStats.losses}L
              </span>
            )}
          </div>

          <div className="profile-body">
            <div className="profile-field-label">Profile image URL</div>
            <input
              type="url"
              className="lb-input"
              placeholder="https://example.com/avatar.png"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError(null);
                setSuccess(false);
              }}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSetProfileUrl(inputValue)
              }
              autoComplete="off"
              spellCheck={false}
            />

            {error && <div className="lb-error">{error}</div>}
            {success && <div className="profile-success">✓ URL saved</div>}

            <button
              type="button"
              className="ln-submit"
              onClick={() => handleSetProfileUrl(inputValue)}
              disabled={loading}
            >
              {loading ? "Saving…" : "Save Image URL"}
            </button>
            <button
              type="button"
              className="ln-submit-logout"
              onClick={() => handleLogOut()}
              disabled={loading}
            >
              {loading ? "Logging Out..." : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
