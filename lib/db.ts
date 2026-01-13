import { sql } from '@vercel/postgres';

export interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface GameSession {
  id: string;
  player_name: string;
  scenario: string;
  stats: CharacterStats;
  current_day: number;
  is_alive: boolean;
  current_lat: number;
  current_lng: number;
  start_lat: number;
  start_lng: number;
  inventory: string[];
  created_at: Date;
  updated_at: Date;
}

export interface PlayerPath {
  id: string;
  game_id: string;
  day: number;
  lat: number;
  lng: number;
  action: string;
  created_at: Date;
}

export interface ZombieLocation {
  lat: number;
  lng: number;
  density: number;
}

// Initialize database tables
export async function initDatabase() {
  try {
    // Create games table
    await sql`
      CREATE TABLE IF NOT EXISTS games (
        id TEXT PRIMARY KEY,
        player_name TEXT NOT NULL,
        scenario TEXT NOT NULL,
        stats JSONB NOT NULL,
        current_day INTEGER DEFAULT 1,
        is_alive BOOLEAN DEFAULT true,
        current_lat DECIMAL(10, 8) NOT NULL,
        current_lng DECIMAL(11, 8) NOT NULL,
        start_lat DECIMAL(10, 8) NOT NULL,
        start_lng DECIMAL(11, 8) NOT NULL,
        inventory JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create player_paths table
    await sql`
      CREATE TABLE IF NOT EXISTS player_paths (
        id TEXT PRIMARY KEY,
        game_id TEXT REFERENCES games(id) ON DELETE CASCADE,
        day INTEGER NOT NULL,
        lat DECIMAL(10, 8) NOT NULL,
        lng DECIMAL(11, 8) NOT NULL,
        action TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Game CRUD operations
export async function createGame(
  playerName: string,
  scenario: string,
  stats: CharacterStats,
  startLat: number,
  startLng: number
): Promise<string> {
  const id = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await sql`
    INSERT INTO games (id, player_name, scenario, stats, current_lat, current_lng, start_lat, start_lng)
    VALUES (${id}, ${playerName}, ${scenario}, ${JSON.stringify(stats)}, ${startLat}, ${startLng}, ${startLat}, ${startLng})
  `;
  
  // Record starting position
  await addPlayerPath(id, 1, startLat, startLng, 'Game started');
  
  return id;
}

export async function getGame(gameId: string): Promise<GameSession | null> {
  const result = await sql`
    SELECT * FROM games WHERE id = ${gameId}
  `;
  
  if (result.rows.length === 0) return null;
  
  const row = result.rows[0];
  return {
    id: row.id,
    player_name: row.player_name,
    scenario: row.scenario,
    stats: row.stats as CharacterStats,
    current_day: row.current_day,
    is_alive: row.is_alive,
    current_lat: parseFloat(row.current_lat),
    current_lng: parseFloat(row.current_lng),
    start_lat: parseFloat(row.start_lat),
    start_lng: parseFloat(row.start_lng),
    inventory: row.inventory || [],
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function updateGamePosition(
  gameId: string,
  day: number,
  lat: number,
  lng: number,
  action: string
) {
  await sql`
    UPDATE games 
    SET current_day = ${day}, current_lat = ${lat}, current_lng = ${lng}, updated_at = NOW()
    WHERE id = ${gameId}
  `;
  
  await addPlayerPath(gameId, day, lat, lng, action);
}

export async function updateGameInventory(gameId: string, inventory: string[]) {
  await sql`
    UPDATE games 
    SET inventory = ${JSON.stringify(inventory)}, updated_at = NOW()
    WHERE id = ${gameId}
  `;
}

export async function endGame(gameId: string) {
  await sql`
    UPDATE games 
    SET is_alive = false, updated_at = NOW()
    WHERE id = ${gameId}
  `;
}

export async function addPlayerPath(
  gameId: string,
  day: number,
  lat: number,
  lng: number,
  action: string
) {
  const id = `path_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await sql`
    INSERT INTO player_paths (id, game_id, day, lat, lng, action)
    VALUES (${id}, ${gameId}, ${day}, ${lat}, ${lng}, ${action})
  `;
}

export async function getPlayerPaths(gameId: string): Promise<PlayerPath[]> {
  const result = await sql`
    SELECT * FROM player_paths 
    WHERE game_id = ${gameId}
    ORDER BY day ASC, created_at ASC
  `;
  
  return result.rows.map(row => ({
    id: row.id,
    game_id: row.game_id,
    day: row.day,
    lat: parseFloat(row.lat),
    lng: parseFloat(row.lng),
    action: row.action,
    created_at: row.created_at,
  }));
}

export async function getAllDeadGamePaths(): Promise<{ gameId: string; playerName: string; paths: PlayerPath[] }[]> {
  const result = await sql`
    SELECT g.id, g.player_name, p.id as path_id, p.day, p.lat, p.lng, p.action, p.created_at
    FROM games g
    LEFT JOIN player_paths p ON g.id = p.game_id
    WHERE g.is_alive = false
    ORDER BY g.id, p.day ASC, p.created_at ASC
  `;
  
  const gamesMap = new Map<string, { gameId: string; playerName: string; paths: PlayerPath[] }>();
  
  for (const row of result.rows) {
    if (!gamesMap.has(row.id)) {
      gamesMap.set(row.id, {
        gameId: row.id,
        playerName: row.player_name,
        paths: [],
      });
    }
    
    if (row.path_id) {
      gamesMap.get(row.id)!.paths.push({
        id: row.path_id,
        game_id: row.id,
        day: row.day,
        lat: parseFloat(row.lat),
        lng: parseFloat(row.lng),
        action: row.action,
        created_at: row.created_at,
      });
    }
  }
  
  return Array.from(gamesMap.values());
}
