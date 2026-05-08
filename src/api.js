const API = import.meta.env.VITE_API_URL;

export const planTrip = async (data) => {
  const res = await fetch(`${API}/api/plan-trip`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};