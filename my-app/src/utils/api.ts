const API_BASE_URL = 'http://localhost:3001/api/games';

export async function getGames(search?: string) {
  const url = new URL(API_BASE_URL);
  if (search) {
    url.searchParams.append('search', search);
  }
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Failed to fetch games');
  }
  return await response.json();
}

