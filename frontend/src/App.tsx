import React, { useState } from "react";
import "./App.css";

//definition
type Item = {
  name: string;
  price: number;
};

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState<Item[]>([]);

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

  return (
    <div className="App">
      <h1>Receipt Splitter</h1>
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload}>Upload</button>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
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
