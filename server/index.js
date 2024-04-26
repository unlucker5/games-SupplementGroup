/* eslint-disable no-console */
const { existsSync, readFileSync, writeFileSync } = require('fs');
const { createServer } = require('http');

const DB_FILE = process.env.DB_FILE || './db.json';
const PORT = process.env.PORT || 3001;
const URI_PREFIX = '/api/games';

class ApiError extends Error {
  constructor(statusCode, data) {
    super();
    this.statusCode = statusCode;
    this.data = data;
  }
}

function drainJson(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(JSON.parse(data));
    });
  });
}

function getGameList(params = {}) {
  const games = JSON.parse(readFileSync(DB_FILE) || '[]');
  if (params.search) {
    const search = params.search.trim().toLowerCase();
    return games.filter(game => game.name.toLowerCase().includes(search));
  }
  return games;
}

function createGame(data) {
  const newGame = {
    id: Date.now().toString(),
    name: data.name || '',
    rating: data.rating || null,
    poster: data.poster || '',
    screenshots: data.screenshots || [],
    platforms: data.platforms || [],
    multiplayer: data.multiplayer || { offline: 0, online: 0 },
    languages: data.languages || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  writeFileSync(DB_FILE, JSON.stringify([...getGameList(), newGame]), { encoding: 'utf8' });
  return newGame;
}

function getGame(gameId) {
  const game = getGameList().find(({ id }) => id === gameId);
  if (!game) throw new ApiError(404, { message: 'Game Not Found' });
  return game;
}

function updateGame(gameId, data) {
  const games = getGameList();
  const gameIndex = games.findIndex(({ id }) => id === gameId);
  if (gameIndex === -1) throw new ApiError(404, { message: 'Game Not Found' });
  Object.assign(games[gameIndex], {
    name: data.name || games[gameIndex].name,
    rating: data.rating || games[gameIndex].rating,
    poster: data.poster || games[gameIndex].poster,
    screenshots: data.screenshots || games[gameIndex].screenshots,
    platforms: data.platforms || games[gameIndex].platforms,
    multiplayer: data.multiplayer || games[gameIndex].multiplayer,
    languages: data.languages || games[gameIndex].languages,
    updatedAt: new Date().toISOString()
  });
  writeFileSync(DB_FILE, JSON.stringify(games), { encoding: 'utf8' });
  return games[gameIndex];
}

function deleteGame(gameId) {
  const games = getGameList();
  const gameIndex = games.findIndex(({ id }) => id === gameId);
  if (gameIndex === -1) throw new ApiError(404, { message: 'Game Not Found' });
  games.splice(gameIndex, 1);
  writeFileSync(DB_FILE, JSON.stringify(games), { encoding: 'utf8' });
  return {};
}

if (!existsSync(DB_FILE)) writeFileSync(DB_FILE, '[]', { encoding: 'utf8' });

module.exports = createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }

  if (!req.url || !req.url.startsWith(URI_PREFIX)) {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Not Found' }));
    return;
  }

  const [uri, query] = req.url.substr(URI_PREFIX.length).split('?');
  const queryParams = {};
  if (query) {
    for (const piece of query.split('&')) {
      const [key, value] = piece.split('=');
      queryParams[key] = value ? decodeURIComponent(value) : '';
    }
  }

  try {
    const body = await (async () => {
      if (uri === '' || uri === '/') {
        if (req.method === 'GET') return getGameList(queryParams);
        if (req.method === 'POST') {
          const createdGame = createGame(await drainJson(req));
          res.statusCode = 201;
          res.setHeader('Access-Control-Expose-Headers', 'Location');
          res.setHeader('Location', `${URI_PREFIX}/${createdGame.id}`);
          return createdGame;
        }
      } else {
        const gameId = uri.substr(1);
        if (req.method === 'GET') return getGame(gameId);
        if (req.method === 'PATCH') return updateGame(gameId, await drainJson(req));
        if (req.method === 'DELETE') return deleteGame(gameId);
      }
      return null;
    })();
    res.end(JSON.stringify(body));
  } catch (err) {
    if (err instanceof ApiError) {
      res.writeHead(err.statusCode);
      res.end(JSON.stringify(err.data));
    } else {
      res.statusCode = 500;
      res.end(JSON.stringify({ message: 'Server Error' }));
      console.error(err);
    }
  }
}).listen(PORT, () => {
  console.log(`Сервер игр запущен. Вы можете использовать его по адресу http://localhost:${PORT}`);
});
