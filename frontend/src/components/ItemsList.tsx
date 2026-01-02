import React, { useState } from "react";
import { Item, Friend } from "../types";

interface Props {
  items: Item[];
  friends: Friend[];
  addItem: (name: string, price: number) => void;
  deleteItem: (name: string) => void;
  toggleSharedBy: (itemName: string, friendName: string) => void;
  loading: boolean;
  error: string | null;
}

const ItemsList = ({ items, friends, addItem, deleteItem, toggleSharedBy, loading, error }: Props) => {
  const [newItem, setNewItem] = useState("");
  const [newPrice, setNewPrice] = useState<number | "">("");

  if (loading) return <div>Loading items...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
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
      <button
        onClick={() => {
          if (!newItem || !newPrice) return;
          addItem(newItem, newPrice);
          setNewItem("");
          setNewPrice("");
        }}
      >
        Add Item
      </button>

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
          {items.map((item) => (
            <tr key={item.name}>
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
                <button onClick={() => deleteItem(item.name)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemsList;
