'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import GameMap from '../../components/GameMap';
import GameRecap from '../../components/GameRecap';
import { GameSession } from '@/lib/db';

interface Props {
  params: Promise<{ gameId: string }>;
}

export default function GamePage({ params }: Props) {
  const { gameId } = use(params);
  const [game, setGame] = useState<GameSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRecap, setShowRecap] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchGame();
  }, [gameId]);

  const fetchGame = async () => {
    try {
      const response = await fetch(`/api/game/${gameId}`);
      const data = await response.json();

      if (data.game) {
        setGame(data.game);
        // Show recap if game is over
        if (!data.game.is_alive || data.game.current_day >= 30) {
          setShowRecap(true);
        }
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to fetch game:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (lat: number, lng: number, locationType: string, action: string) => {
    const response = await fetch(`/api/game/${gameId}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetLat: lat, targetLng: lng, locationType, action }),
    });

    const result = await response.json();

    // Refresh game state
    await fetchGame();

    if (result.died || result.won) {
      setShowRecap(true);
    }

    return result;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-xl">Loading game...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-xl">Game not found</div>
      </div>
    );
  }

  if (showRecap) {
    return (
      <GameRecap
        gameId={game.id}
        playerName={game.player_name}
        finalDay={game.current_day}
        survived={game.is_alive && game.current_day >= 30}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-red-900 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-red-500">{game.player_name}</h1>
            <p className="text-gray-400 text-sm capitalize">{game.scenario.replace('-', ' ')}</p>
          </div>
          <div className="text-right">
            <div className="text-white font-bold">Day {game.current_day} / 30</div>
            <div className="text-gray-400 text-sm">{game.is_alive ? '✅ Alive' : '💀 Dead'}</div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gray-700 border-b border-gray-600 p-2">
        <div className="max-w-6xl mx-auto flex justify-around text-center text-xs">
          <div>
            <div className="text-gray-400">STR</div>
            <div className="text-white font-bold">{game.stats.strength}</div>
          </div>
          <div>
            <div className="text-gray-400">DEX</div>
            <div className="text-white font-bold">{game.stats.dexterity}</div>
          </div>
          <div>
            <div className="text-gray-400">CON</div>
            <div className="text-white font-bold">{game.stats.constitution}</div>
          </div>
          <div>
            <div className="text-gray-400">INT</div>
            <div className="text-white font-bold">{game.stats.intelligence}</div>
          </div>
          <div>
            <div className="text-gray-400">WIS</div>
            <div className="text-white font-bold">{game.stats.wisdom}</div>
          </div>
          <div>
            <div className="text-gray-400">CHA</div>
            <div className="text-white font-bold">{game.stats.charisma}</div>
          </div>
        </div>
      </div>

      {/* Game Map */}
      <div className="flex-1">
        <GameMap game={game} onMove={handleMove} />
      </div>
    </div>
  );
}
