import React, { useState, useEffect } from "react";
import "./App.css";

//definition
type Item = {
  name: string;
  price: number;
};

type Friend = {
  name: string;
};

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState<Item[]>([]);

  //friend constant
  const [friends, setFriends] = useState<Friend[]>([]);
  const [newFriend, setNewFriend] = useState(""); 

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

  //fetch friends from backend
  const fetchFriends = async () => {
    const res = await fetch("http://localhost:8000/friends");
    const data = await res.json();
    setFriends(data);
  };

  //makes friends list update when page reloads
  useEffect(() => {
    fetchFriends();
  }, []);

  //add friend
  const handleAddFriend = async () => {
    console.log("Add friend clicked:", newFriend);
    if (!newFriend) return;
    const res = await fetch("http://localhost:8000/friends", {
    method: "POST",
    body: JSON.stringify({ name: newFriend }),
    headers: { "Content-Type": "application/json" }   });
    const addedFriend = await res.json();
    setFriends((prev) => [...prev, addedFriend]); // update frontend state immediately
    setNewFriend("");
  };

  return (
    <div className="App">
      <h1>Receipt Splitter</h1>
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload}>Upload</button>

      <h2>Friends</h2>
      <ul>
        {friends.map((friend, idx) => (<li key={idx}>{friend.name}</li>))}
      </ul>
      <input value={newFriend} onChange={(e) => setNewFriend(e.target.value)} placeholder="Add a friend"/>
      <button onClick ={handleAddFriend}>Add Friend</button>


      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            //map is a loop. index only needed for TS to keep track between copies
            <tr key={index}> 
              <td>{item.name}</td>
              <td>${item.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
