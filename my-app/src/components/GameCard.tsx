import React from 'react';
import { Game } from '../types/Game';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <div className="game-card">
      <div className='left-column'>
        <img src={game.poster} alt={game.name} />
      </div>
      <div className="right-column">
        <h3>{game.name}</h3>
        <p>Рейтинг: {game.rating}</p>
        <p>Платформы: {game.platforms.join(', ')}</p>
        <p>Языки: {game.languages.join(', ')}</p>
        <p>Offline - {game.multiplayer.offline}, Online - {game.multiplayer.online}</p>
      </div>

    </div>
  );
}

