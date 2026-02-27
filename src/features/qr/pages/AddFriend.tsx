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
        <div className="addfriend-input-group">
          <input
            type="text"
            placeholder="Enter friend userId"
            value={friendId}
            onChange={(e) => setFriendId(e.target.value)}
            className="input-clean addfriend-input"
          />

          <button onClick={handleSubmit} className="btn-primary addfriend-btn">
            Add
          </button>
        </div>

        {/* Divider */}
        <div className="addfriend-divider">
          <span>My ID</span>
        </div>

        {/* My ID Section */}
        <div className="addfriend-myid">
          <span className="addfriend-myid-text">@{userId}</span>

          <button className="addfriend-copy-btn" onClick={handleCopy}>
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
