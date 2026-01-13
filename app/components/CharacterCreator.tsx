'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateRandomStats, getStatModifier } from '@/lib/game-logic';
import { CharacterStats } from '@/lib/db';

interface Props {
  scenario: string;
}

export default function CharacterCreator({ scenario }: Props) {
  const [playerName, setPlayerName] = useState('');
  const [stats, setStats] = useState<CharacterStats | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Generate initial random stats
    setStats(generateRandomStats());
  }, []);

  const handleReroll = () => {
    setStats(generateRandomStats());
  };

  const handleStatChange = (stat: keyof CharacterStats, value: number) => {
    if (stats && value >= 3 && value <= 18) {
      setStats({ ...stats, [stat]: value });
    }
  };

  const handleCreateCharacter = async () => {
    if (!playerName.trim() || !stats) return;

    setLoading(true);

    try {
      // Generate random starting location (will be done by game logic)
      const response = await fetch('/api/game/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: playerName.trim(),
          scenario,
          stats,
          startLat: 39.7392 + (Math.random() - 0.5) * 0.3,
          startLng: -104.9903 + (Math.random() - 0.5) * 0.5,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/game/${data.gameId}`);
      } else {
        alert('Failed to create character. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const statNames: Array<keyof CharacterStats> = [
    'strength',
    'dexterity',
    'constitution',
    'intelligence',
    'wisdom',
    'charisma',
  ];

  const statDescriptions: Record<keyof CharacterStats, string> = {
    strength: 'Physical power and melee combat',
    dexterity: 'Agility, reflexes, and dodge chance',
    constitution: 'Health, stamina, and survival',
    intelligence: 'Problem solving and planning',
    wisdom: 'Awareness and decision making',
    charisma: 'Leadership and negotiation',
  };

  if (!stats) return <div className="text-white">Loading...</div>;

  const totalPoints = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-500 mb-2">CREATE YOUR CHARACTER</h1>
          <p className="text-gray-400">
            Scenario: <span className="text-white font-semibold capitalize">{scenario.replace('-', ' ')}</span>
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 border border-red-900 space-y-6">
          {/* Player Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Character Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your character's name"
              maxLength={30}
            />
          </div>

          {/* Stats Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Character Stats</h2>
              <button
                onClick={handleReroll}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🎲 Reroll All
              </button>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <p className="text-gray-300 text-sm">
                Total Points: <span className="text-white font-bold">{totalPoints}</span> / 108 max
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Stats range from 3 to 18. Modifiers are calculated D&D 5e style.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {statNames.map((statName) => {
                const value = stats[statName];
                const modifier = getStatModifier(value);
                const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;

                return (
                  <div key={statName} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-white font-bold capitalize">{statName}</label>
                      <span className="text-2xl font-bold text-red-400">{value}</span>
                    </div>
                    <p className="text-gray-400 text-xs mb-3">{statDescriptions[statName]}</p>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="3"
                        max="18"
                        value={value}
                        onChange={(e) => handleStatChange(statName, parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-gray-300 text-sm w-12 text-right">
                        ({modifierStr})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreateCharacter}
            disabled={loading || !playerName.trim()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? 'Creating Character...' : 'Begin Survival'}
          </button>
        </div>
      </div>
    </div>
  );
}
