import { Item } from "./types";

export const fetchItems = async (): Promise<Item[]> => {
  const res = await fetch("http://localhost:8000/items");
  return res.json();
};

export const addItem = async (item: Item): Promise<Item> => {
  const res = await fetch("http://localhost:8000/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  return res.json();
};

export const deleteItem = async (name: string): Promise<boolean> => {
  const res = await fetch(`http://localhost:8000/items/${encodeURIComponent(name)}`, {
    method: "DELETE",
  });
  return res.ok;
};
