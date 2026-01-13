'use client';

import { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { PlayerPath } from '@/lib/db';

interface Props {
  gameId: string;
  playerName: string;
  finalDay: number;
  survived: boolean;
}

interface DeadGameData {
  gameId: string;
  playerName: string;
  paths: PlayerPath[];
}

export default function GameRecap({ gameId, playerName, finalDay, survived }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [paths, setPaths] = useState<PlayerPath[]>([]);
  const [allDeadPaths, setAllDeadPaths] = useState<DeadGameData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaths();
  }, [gameId]);

  useEffect(() => {
    if (paths.length > 0 && !map) {
      initMap();
    }
  }, [paths, map]);

  const fetchPaths = async () => {
    try {
      // Fetch current game paths
      const response = await fetch(`/api/game/${gameId}/paths`);
      const data = await response.json();
      setPaths(data.paths || []);

      // Fetch all dead game paths
      const allPathsResponse = await fetch(`/api/game/${gameId}/paths?includeAllDead=true`);
      const allPathsData = await allPathsResponse.json();
      setAllDeadPaths(allPathsData.allDeadPaths || []);
    } catch (error) {
      console.error('Failed to fetch paths:', error);
    } finally {
      setLoading(false);
    }
  };

  const initMap = async () => {
    setOptions({
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      v: 'weekly',
    });

    await importLibrary('maps');

    if (mapRef.current && paths.length > 0) {
      const startPos = { lat: paths[0].lat, lng: paths[0].lng };

      const mapInstance = new google.maps.Map(mapRef.current, {
        center: startPos,
        zoom: 12,
        mapTypeId: 'roadmap',
        styles: [
          {
            elementType: 'geometry',
            stylers: [{ color: '#242f3e' }],
          },
          {
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#242f3e' }],
          },
          {
            elementType: 'labels.text.fill',
            stylers: [{ color: '#746855' }],
          },
        ],
      });

      setMap(mapInstance);

      // Draw all other dead player paths (in gray)
      allDeadPaths.forEach((deadGame) => {
        if (deadGame.gameId !== gameId && deadGame.paths.length > 0) {
          const pathCoords = deadGame.paths.map((p) => ({ lat: p.lat, lng: p.lng }));

          new google.maps.Polyline({
            path: pathCoords,
            geodesic: true,
            strokeColor: '#666666',
            strokeOpacity: 0.4,
            strokeWeight: 2,
            map: mapInstance,
          });

          // Start marker for other players
          new google.maps.Marker({
            position: pathCoords[0],
            map: mapInstance,
            title: deadGame.playerName,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 6,
              fillColor: '#666666',
              fillOpacity: 0.6,
              strokeWeight: 1,
              strokeColor: '#ffffff',
            },
          });
        }
      });

      // Draw current player's path (in red)
      const currentPathCoords = paths.map((p) => ({ lat: p.lat, lng: p.lng }));

      new google.maps.Polyline({
        path: currentPathCoords,
        geodesic: true,
        strokeColor: '#ff0000',
        strokeOpacity: 0.8,
        strokeWeight: 4,
        map: mapInstance,
      });

      // Add markers for current player
      paths.forEach((path, index) => {
        const isStart = index === 0;
        const isEnd = index === paths.length - 1;

        new google.maps.Marker({
          position: { lat: path.lat, lng: path.lng },
          map: mapInstance,
          title: `Day ${path.day}: ${path.action}`,
          label: isStart ? 'S' : isEnd ? 'E' : `${path.day}`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: isStart || isEnd ? 10 : 7,
            fillColor: isStart ? '#00ff00' : isEnd ? '#ff0000' : '#ffff00',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#000000',
          },
        });
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-xl">Loading recap...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-red-900 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-red-500 mb-2">
            {survived ? '🎉 VICTORY!' : '💀 GAME OVER'}
          </h1>
          <p className="text-white text-lg">
            {playerName} survived for {finalDay - 1} day{finalDay - 1 !== 1 ? 's' : ''}
          </p>
          <p className="text-gray-400">
            {survived
              ? 'Congratulations! You survived the zombie apocalypse!'
              : 'You were killed by zombies. Better luck next time!'}
          </p>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-gray-800/95 rounded-lg p-4 border border-red-900">
          <h3 className="text-white font-bold mb-2">Legend</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-white">Your Path</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
              <span className="text-white">Other Players</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-white">Start (S)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-white">End (E)</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="absolute top-4 right-4 bg-gray-800/95 rounded-lg p-4 border border-red-900 max-w-sm max-h-96 overflow-y-auto">
          <h3 className="text-white font-bold mb-3">📅 Timeline</h3>
          <div className="space-y-2">
            {paths.map((path, index) => (
              <div
                key={path.id}
                className="bg-gray-700 rounded p-2 text-sm"
              >
                <div className="text-yellow-400 font-semibold">Day {path.day}</div>
                <div className="text-white">{path.action}</div>
                <div className="text-gray-400 text-xs">
                  {path.lat.toFixed(4)}, {path.lng.toFixed(4)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-gray-800 border-t border-red-900 p-4">
        <div className="max-w-6xl mx-auto flex justify-center space-x-4">
          <button
            onClick={() => (window.location.href = '/select-scenario')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Play Again
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
