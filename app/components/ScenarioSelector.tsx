'use client';

import { useRouter } from 'next/navigation';

const scenarios = [
  {
    id: 'zombie-apocalypse',
    name: 'Zombie Apocalypse',
    description: 'The dead have risen. Survive 30 days in a city overrun by zombies.',
    icon: '🧟',
    difficulty: 'Medium',
    available: true,
  },
  {
    id: 'nuclear-fallout',
    name: 'Nuclear Fallout',
    description: 'Nuclear war has devastated civilization. Survive the radiation.',
    icon: '☢️',
    difficulty: 'Hard',
    available: false,
  },
  {
    id: 'pandemic',
    name: 'Global Pandemic',
    description: 'A deadly virus spreads rapidly. Find supplies and avoid infection.',
    icon: '🦠',
    difficulty: 'Easy',
    available: false,
  },
  {
    id: 'alien-invasion',
    name: 'Alien Invasion',
    description: 'Extraterrestrial forces have invaded Earth. Stay hidden and survive.',
    icon: '👽',
    difficulty: 'Hard',
    available: false,
  },
];

export default function ScenarioSelector() {
  const router = useRouter();

  const handleSelectScenario = (scenarioId: string) => {
    if (scenarioId === 'zombie-apocalypse') {
      router.push(`/create-character?scenario=${scenarioId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-red-500 mb-4">
            SELECT YOUR CATASTROPHE
          </h1>
          <p className="text-gray-400 text-lg">
            Choose the scenario you want to survive
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`bg-gray-800 rounded-lg p-6 border-2 ${
                scenario.available
                  ? 'border-red-900 hover:border-red-600 cursor-pointer transform hover:scale-105'
                  : 'border-gray-700 opacity-50 cursor-not-allowed'
              } transition-all`}
              onClick={() => scenario.available && handleSelectScenario(scenario.id)}
            >
              <div className="flex items-start space-x-4">
                <div className="text-6xl">{scenario.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-white">{scenario.name}</h2>
                    {!scenario.available && (
                      <span className="bg-gray-700 text-gray-400 px-3 py-1 rounded-full text-sm">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 mb-4">{scenario.description}</p>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      scenario.difficulty === 'Easy' ? 'bg-green-900 text-green-200' :
                      scenario.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-200' :
                      'bg-red-900 text-red-200'
                    }`}>
                      {scenario.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
