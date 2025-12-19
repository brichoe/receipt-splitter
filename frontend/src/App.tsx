import React, { useState, useEffect } from "react";
import { Item, Friend } from "./types";
import * as itemService from "./ItemService";
import * as friendService from "./FriendService";
import "./App.css";

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [newItem, setNewItem] = useState("");
  const [newPrice, setNewPrice] = useState<number | "">("");
  const [newFriend, setNewFriend] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Load data on mount
  useEffect(() => {
    loadItems();
    loadFriends();
  }, []);

  const loadItems = async () => setItems(await itemService.fetchItems());
  const loadFriends = async () => setFriends(await friendService.fetchFriends());

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



  const handleAddItem = async () => {
    if (!newItem.trim() || newPrice === "" || newPrice <= 0) return;
    const added = await itemService.addItem({ name: newItem, price: newPrice, purchasedBy: [] });
    setItems((prev) => [...prev, added]);
    setNewItem("");
    setNewPrice("");
  };

  const handleDeleteItem = async (name: string) => {
    const ok = await itemService.deleteItem(name);
    if (ok) setItems((prev) => prev.filter((i) => i.name !== name));
  };

  const handleAddFriend = async () => {
    if (!newFriend.trim()) return;
    const added = await friendService.addFriend(newFriend);
    setFriends((prev) => [...prev, added]);
    setNewFriend("");
  };

  const toggleSharedBy = (itemName: string, friendName: string) => {
  setItems((prevItems) =>
    prevItems.map((item) => {
      if (item.name !== itemName) return item;

      const isAlreadyShared = item.purchasedBy.includes(friendName);
      const updatedPurchasedBy = isAlreadyShared
        ? item.purchasedBy.filter((name) => name !== friendName)
        : [...item.purchasedBy, friendName];

      // Optional: send update to backend here
      // updateItemSharedBy(item.name, updatedPurchasedBy);

      // Call backend to update
      fetch(`http://localhost:8000/items/${encodeURIComponent(itemName)}/shared-by`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchasedBy: updatedPurchasedBy }),
      });

      return { ...item, purchasedBy: updatedPurchasedBy };
    })
  );
};


//compute totals

const calculateTotals = () => {
  const totals: Record<string, number> = {};

  // initialize all totals to 0
  friends.forEach((friend) => {
    totals[friend.name] = 0;
  });

  // iterate over items
  items.forEach((item) => {
    const numSharers = item.purchasedBy.length;
    if (numSharers === 0) return; // skip items not shared by anyone

    const shareAmount = item.price / numSharers;

    item.purchasedBy.forEach((friendName) => {
      totals[friendName] += shareAmount;
    });
  });

  return totals;
};


  return (
    <div className="App">
      <h1>Receipt Splitter</h1>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
<button onClick={handleUpload}>Upload</button>
      {/* Friends */}
      <h2>Friends</h2>
      <input
        value={newFriend}
        onChange={(e) => setNewFriend(e.target.value)}
        placeholder="Add a friend"
      />
      <button onClick={handleAddFriend}>Add Friend</button>
      <ul>{friends.map((f, idx) => <li key={idx}>{f.name}</li>)}</ul>

      {/* Items */}
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
          {items.map((item, idx) => (
        <tr key={idx}>
    <td>{item.name}</td>
    <td>${item.price.toFixed(2)}</td>
    <td>
      {friends.map((friend) => (
        <label key={friend.name} style={{ marginRight: 8 }}>
          <input
            type="checkbox"
            checked={item.purchasedBy.includes(friend.name)}
            onChange={() => toggleSharedBy(item.name, friend.name)}
          />
          {friend.name}
        </label>
      ))}
    </td>
    <td>
      <button onClick={() => handleDeleteItem(item.name)}>Delete</button>
    </td>
  </tr>
))}
        </tbody>
      </table>



      <h2>Totals</h2>
<ul>
  {Object.entries(calculateTotals()).map(([friend, total]) => (
    <li key={friend}>
      {friend}: ${total.toFixed(2)}
    </li>
  ))}
</ul>


    </div>
  );
}

export default App;
