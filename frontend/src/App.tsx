import React, { useState, useEffect } from "react";
import "./App.css";

// Type definitions
type Item = {
  name: string;
  price: number;
  purchasedBy: string[];
};

type Friend = {
  name: string;
};

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState("");
  const [newPrice, setNewPrice] = useState<number | "">("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [newFriend, setNewFriend] = useState("");

  // -------------------
  // Upload receipt
  // -------------------
  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/upload-receipt", {
      method: "POST",
      body: formData,
    });

    const data: { items: Item[] } = await res.json();
    setItems(data.items);
  };

  // -------------------
  // Fetch friends
  // -------------------
  const fetchFriends = async () => {
    const res = await fetch("http://localhost:8000/friends");
    const data = await res.json();
    setFriends(data);
  };

  useEffect(() => {
    fetchFriends();
    fetchItems(); // fetch items on page load
  }, []);

  // -------------------
  // Add friend
  // -------------------
  const handleAddFriend = async () => {
    if (!newFriend.trim()) return;
    const res = await fetch("http://localhost:8000/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newFriend }),
    });
    const addedFriend = await res.json();
    setFriends((prev) => [...prev, addedFriend]);
    setNewFriend("");
  };

  // -------------------
  // Fetch items
  // -------------------
  const fetchItems = async () => {
    const res = await fetch("http://localhost:8000/items");
    const data = await res.json();
    setItems(data);
  };

  // -------------------
  // Delete item
  // -------------------
  const deleteItem = async (name: string) => {
    const res = await fetch(`http://localhost:8000/items/${encodeURIComponent(name)}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setItems(items.filter((item) => item.name !== name));
    } else {
      const error = await res.json();
      alert(error.detail);
    }
  };

    // -------------------
  // Add item
  // -------------------
  const handleAddItem = async () => {
    if (!newItem.trim() || newPrice === "" || newPrice <= 0) {
      alert("Please enter a valid item name and price");
      return;
    }

    const res = await fetch("http://localhost:8000/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newItem, price: newPrice, purchasedBy: [] }),
    });
    
    const addedItem = await res.json();
    setItems((prev) => [...prev, addedItem]);
    setNewItem("");
    setNewPrice("");
  };

  return (
    <div className="App">
      <h1>Receipt Splitter</h1>

      {/* Upload receipt */}
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload}>Upload</button>

      {/* Friends list */}
      <h2>Friends</h2>

      <input
        value={newFriend}
        onChange={(e) => setNewFriend(e.target.value)}
        placeholder="Add a friend"
      />
      <button onClick={handleAddFriend}>Add Friend</button>


      <ul>
        {friends.map((friend, idx) => (
          <li key={idx}>{friend.name}</li>
        ))}
      </ul>
      
      {/* Items table */}
      <h2>Items</h2>
      <input
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="Item name"
      />
      <input
        type="number"
        value={newPrice}
        onChange={(e) => setNewPrice(Number(e.target.value))}
        placeholder="Price"
      />
      <button onClick={handleAddItem}>Add Item</button>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Shared By</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>{item.purchasedBy.join(", ")}</td>
              <td>
                <button onClick={() => deleteItem(item.name)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
