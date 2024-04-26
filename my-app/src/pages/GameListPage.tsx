import React, { useState, useEffect } from 'react';
import { Game } from '../types/Game';
import { GameCard } from '../components/GameCard';
import { getGames } from '../utils/api';
import { Filter } from '../components/Filter';

export function GameListPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [sortBy, setSortBy] = useState<string>('');

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const gamesData = await getGames();
      setGames(gamesData);
      setFilteredGames(gamesData);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const handleFilterChange = (platform: string | null, multiplayer: string | null, hasRussian: boolean | null) => {
    let filteredData = [...games];

    if (platform) {
      filteredData = filteredData.filter(game => game.platforms.includes(platform));
    }
    if (multiplayer) {
      if (multiplayer === 'offline') {
        filteredData = filteredData.filter(game => game.multiplayer.offline);
      } else if (multiplayer === 'online') {
        filteredData = filteredData.filter(game => game.multiplayer.online);
      }
    }
    if (hasRussian) {
      filteredData = filteredData.filter(game => game.languages.includes('Russian'));
    }

    const sortedData = handleSortChange(sortBy, filteredData);
    setFilteredGames(sortedData);
  };

  const handleSortTypeChange = (sortType: string) => {
    setSortBy(sortType)
    const sortedData = handleSortChange(sortType, filteredGames);
    setFilteredGames(sortedData);
  };

  const handleSortChange = (sortType: string, data: Game[]) => {
    let sortedData = [...data];
  
    if (sortType === 'rating') {
      sortedData = sortedData.sort((a, b) => b.rating - a.rating);
    }
  
    return sortedData;
  };

  return (
    <div className='container'>
      <h1>Список игр</h1>
      <Filter onFilterChange={handleFilterChange} onSortChange={handleSortTypeChange} />
      <div className="game-list">
        {filteredGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
