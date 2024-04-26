import React, { useState } from 'react';

interface FilterProps {
  onFilterChange: (platform: string | null, multiplayer: string | null, hasRussian: boolean) => void;
  onSortChange: (sortType: string) => void;
}

export function Filter({ onFilterChange, onSortChange }: FilterProps) {
  const [platform, setPlatform] = useState<string | null>(null);
  const [multiplayer, setMultiplayer] = useState<string | null>(null);
  const [hasRussian, setHasRussian] = useState<boolean>(false);
  const [sortType, setSortType] = useState<string>('');

  const handlePlatformChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPlatform = event.target.value === 'all' ? null : event.target.value;
    setPlatform(selectedPlatform);
    onFilterChange(selectedPlatform, multiplayer, hasRussian);
  };

  const handleMultiplayerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMultiplayer = event.target.value === 'all' ? null : event.target.value;
    setMultiplayer(selectedMultiplayer);
    onFilterChange(platform, selectedMultiplayer, hasRussian);
  };

  const handleRussianChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedHasRussian = event.target.checked;
    setHasRussian(selectedHasRussian);
    onFilterChange(platform, multiplayer, selectedHasRussian);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSortType = event.target.value;
    setSortType(selectedSortType);
    onSortChange(selectedSortType === 'none' ? '' : selectedSortType);
  };

  return (
    <div className="filter">
      <label htmlFor="platform">Платформа:</label>
      <select id="platform" onChange={handlePlatformChange} value={platform || 'all'}>
        <option value="all">Все</option>
        <option value="PC">ПК</option>
        <option value="PlayStation">PlayStation</option>
        <option value="Xbox">Xbox</option>
        <option value="Nintendo Switch">Nintendo</option>
      </select>
      
      <label htmlFor="multiplayer">Мультиплеер:</label>
      <select id="multiplayer" onChange={handleMultiplayerChange} value={multiplayer || 'all'}>
        <option value="all">Все</option>
        <option value="offline">Offline</option>
        <option value="online">Online</option>
      </select>

      <label htmlFor="russian">Русский язык:</label>
      <input type="checkbox" id="russian" onChange={handleRussianChange} checked={hasRussian} />
      
      <label htmlFor="sort">Сортировать:</label>
      <select id="sort" onChange={handleSortChange} value={sortType}>
        <option value="none">Никак</option>
        <option value="rating">Рейтинг</option>
      </select>
    </div>
  );
}
