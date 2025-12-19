//for when consolidated

const API_BASE = "http://localhost:8000";

export async function uploadReceipt(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload-receipt`, {
    method: "POST",
    body: formData,
  });

  return res.json();
}

export async function getFriends() {
  const res = await fetch(`${API_BASE}/friends`);
  return res.json();
}

export async function addFriend(name: string) {
  const res = await fetch(`${API_BASE}/friends`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  return res.json();
}
