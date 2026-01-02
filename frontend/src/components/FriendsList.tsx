import React, { useState } from "react";
import { Friend } from "../types";

interface Props {
  friends: Friend[];
  addFriend: (name: string) => void;
  loading: boolean;
  error: string | null;
}

const FriendsList = ({ friends, addFriend, loading, error }: Props) => {
  const [newFriend, setNewFriend] = useState("");

  if (loading) return <div>Loading friends...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Friends</h2>
      <input
        value={newFriend}
        onChange={(e) => setNewFriend(e.target.value)}
        placeholder="Add a friend"
      />
      <button
        onClick={() => {
          if (!newFriend.trim()) return;
          addFriend(newFriend.trim());
          setNewFriend("");
        }}
      >
        Add Friend
      </button>

      <ul>
        {friends.map((friend) => (
          <li key={friend.name}>{friend.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;
