import React, { useState, useEffect } from "react";
import { Item, Friend } from "./types";
import "./App.css";
import UploadReceipt from "./components/UploadReceipt";
import FriendsList from "./components/FriendsList";
import ItemsList from "./components/ItemsList";
import Totals from "./components/Totals";

function App() {
  // Global state
  const [items, setItems] = useState<Item[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [file, setFile] = useState<File | null>(null);

  // Async states
  const [loadingItems, setLoadingItems] = useState(false);
  const [errorItems, setErrorItems] = useState<string | null>(null);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [errorFriends, setErrorFriends] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Load on mount
  useEffect(() => {
    loadItems();
    loadFriends();
  }, []);

  // Fetch items
  const loadItems = async () => {
    setLoadingItems(true);
    setErrorItems(null);
    try {
      const res = await fetch("http://localhost:8000/items");
      if (!res.ok) throw new Error("Failed to fetch items");
      const data: Item[] = await res.json();
      setItems(data);
    } catch (err: any) {
      setErrorItems(err.message); //Error built-in has field message. Can set errorState (string)
    } finally {
      setLoadingItems(false);
    }
  };

  // Fetch friends
  const loadFriends = async () => {
    setLoadingFriends(true);
    setErrorFriends(null);
    try {
      const res = await fetch("http://localhost:8000/friends");
      if (!res.ok) throw new Error("Failed to fetch friends");
      const data: Friend[] = await res.json();
      setFriends(data);
    } catch (err: any) {
      setErrorFriends(err.message);
    } finally {
      setLoadingFriends(false);
    }
  };

  // Upload receipt
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("http://localhost:8000/upload-receipt", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload receipt");
      const data: { items: Item[] } = await res.json();
      setItems(data.items);
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // Add / delete items
  const handleAddItem = async (name: string, price: number) => {
    const res = await fetch("http://localhost:8000/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, purchasedBy: [] }),
    });
    if (!res.ok) return;
    const newItem: Item = await res.json();
    setItems((prev) => [...prev, newItem]);
  };

  const handleDeleteItem = async (name: string) => {
    const res = await fetch(`http://localhost:8000/items/${encodeURIComponent(name)}`, {
      method: "DELETE",
    });
    if (!res.ok) return; //if fail
    setItems((prev) => prev.filter((i) => i.name !== name));
  };

  // Add friend
  const handleAddFriend = async (name: string) => {
    const res = await fetch("http://localhost:8000/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) return;
    const newFriend: Friend = await res.json();
    setFriends((prev) => [...prev, newFriend]);
  };

  // Toggle sharedBy
  const toggleSharedBy = async (itemName: string, friendName: string) => {
    const item = items.find((i) => i.name === itemName);
    if (!item) return;

    const updatedPurchasedBy = item.purchasedBy.includes(friendName)
      ? item.purchasedBy.filter((f) => f !== friendName)
      : [...item.purchasedBy, friendName];

    const res = await fetch(
      `http://localhost:8000/items/${encodeURIComponent(itemName)}/shared-by`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchasedBy: updatedPurchasedBy }),
      }
    );
    if (!res.ok) return;

    setItems((prev) =>
      prev.map((i) => (i.name === itemName ? { ...i, purchasedBy: updatedPurchasedBy } : i))
    );
  };

  return (
    <div className="App">
      <h1>Receipt Splitter</h1>

      <UploadReceipt
        file={file}
        setFile={setFile}
        onUpload={handleUpload}
        uploading={uploading}
        error={uploadError}
      />

      <FriendsList
        friends={friends}
        addFriend={handleAddFriend}
        loading={loadingFriends}
        error={errorFriends}
      />

      <ItemsList
        items={items}
        friends={friends}
        addItem={handleAddItem}
        deleteItem={handleDeleteItem}
        toggleSharedBy={toggleSharedBy}
        loading={loadingItems}
        error={errorItems}
      />

      <Totals items={items} friends={friends} />
    </div>
  );
}

export default App;
