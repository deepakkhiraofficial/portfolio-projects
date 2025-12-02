// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3500";
const API_BASE = (
  import.meta.env.VITE_API_URL ?? "https://deepakkhiraofficial.netlify.app/"
).replace(/\/$/, "");

async function request(path, options = {}) {
  const res = await fetch(API_BASE + path, options);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function login(username, password) {
  return request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
}

export async function getMaterials(q = "") {
  const url = "/api/materials" + (q ? `?q=${encodeURIComponent(q)}` : "");
  return request(url);
}

export async function createMaterial(payload, token) {
  return request("/api/materials", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function updateMaterial(id, payload, token) {
  return request(`/api/materials/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteMaterial(id, token) {
  return request(`/api/materials/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getMaterialById(id) {
  return request(`/api/materials/${id}`);
}
export async function sendContactMessage(name, email, message) {
  return request("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, message }),
  });
}
