interface Multiplayer {
    offline: number;
    online: number;
}
  
export interface Game {
    id: string;
    name: string;
    rating: number;
    poster: string;
    screenshots: string[];
    platforms: string[];
    multiplayer: Multiplayer;
    languages: string[];
    createdAt: string;
    updatedAt: string;
}