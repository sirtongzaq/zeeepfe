import { useState } from "react";

interface Props {
  userId: string;
  onAddFriend: (userId: string) => void;
}

export default function AddFriend({ userId, onAddFriend }: Props) {
  const [friendId, setFriendId] = useState("");

  const handleSubmit = () => {
    if (!friendId.trim()) return;
    onAddFriend(friendId.trim());
    setFriendId("");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(userId);
  };

  return (
    <div className="addfriend-container">
      <div className="addfriend-card">
        <h2 className="addfriend-title">Add Friend</h2>

        {/* Input Section */}
        <div className="addfriend-input-group text-sm">
          <input
            type="text"
            placeholder="Enter user ID to add (e.g. @abc123...xyz789)"
            value={friendId}
            onChange={(e) => setFriendId(e.target.value)}
            className="input-clean addfriend-input text-sm"
          />

          <button onClick={handleSubmit} className="btn btn-primary">
            Add
          </button>
        </div>

        {/* Divider */}
        <div className="addfriend-divider">
          <span>My ID</span>
        </div>

        {/* My ID Section */}
        <div className="addfriend-myid">
          <span className="addfriend-myid-text font-mono text-primary text-sm break-all">
            @{userId.slice(0, 8)}...{userId.slice(-8)}
          </span>

          <button className="addfriend-copy-btn" onClick={handleCopy}>
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
