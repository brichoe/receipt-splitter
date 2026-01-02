import { Friend } from "../types";

export const fetchFriends = async (): Promise<Friend[]> => {
  const res = await fetch("http://localhost:8000/friends");
  return res.json();
};

export const addFriend = async (name: string): Promise<Friend> => {
  const res = await fetch("http://localhost:8000/friends", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
};
