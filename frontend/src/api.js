const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function getSchemes(params = {}) {
  const queryParams = new URLSearchParams();

  if (params.q) {
    queryParams.set("q", params.q);
  }

  if (params.category && params.category !== "All") {
    queryParams.set("category", params.category);
  }

  const queryString = queryParams.toString();

  const url = queryString
    ? `${API_BASE_URL}/schemes/?${queryString}`
    : `${API_BASE_URL}/schemes/`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch schemes");
  }

  const data = await response.json();

  return data.results;
}


export async function getScheme(id) {
  const response = await fetch(
    `${API_BASE_URL}/schemes/${id}/`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch scheme");
  }

  return response.json();
}


export default API_BASE_URL;