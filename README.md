# 🧟 Apocalypse Survival Game

A turn-based survival game where players navigate global catastrophes, starting with a zombie apocalypse in Denver, Colorado. Built with Next.js, TypeScript, Google Maps, and Vercel Postgres.

## 🎮 Features

### Core Gameplay
- **Password Protected Access**: Secure game entry with configurable password
- **Multiple Scenarios**: Starting with Zombie Apocalypse (more coming soon!)
- **D&D Character System**: Create characters with D&D-style stats (Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma)
- **Turn-Based Movement**: 20km daily travel limit on foot
- **Interactive Map**: Google Maps integration showing Denver city
- **Location Interaction**: Visit stores, restaurants, and other locations to gather supplies
- **Survival Mechanics**: 
  - D20 skill checks for zombie encounters
  - Population density affects zombie spawn rates
  - Inventory management
  - 30-day survival goal

### Advanced Features
- **Path Tracking**: All player movements are stored in database
- **Game Recap**: After death/victory, see your complete journey on the map
- **Multi-Player Visualization**: View paths of other players (shown after game ends)
- **Dynamic Encounters**: Zombie encounters based on location type and population density
- **Supply Gathering**: Different locations yield different supplies

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Vercel account (for hosting and database)
- Google Maps API key

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd apocalypse-survival
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`
   - Configure the following:

   ```env
   # Vercel Postgres (get from Vercel dashboard)
   POSTGRES_URL=your-postgres-url
   POSTGRES_PRISMA_URL=your-postgres-prisma-url
   POSTGRES_URL_NON_POOLING=your-postgres-non-pooling-url
   POSTGRES_USER=your-postgres-user
   POSTGRES_HOST=your-postgres-host
   POSTGRES_PASSWORD=your-postgres-password
   POSTGRES_DATABASE=your-postgres-database

   # Authentication
   SESSION_SECRET=your-secret-key-min-32-characters-long
   GAME_PASSWORD=your-game-password

   # Google Maps
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

3. **Set up Vercel Postgres:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Create a new Postgres database
   - Copy the connection strings to your `.env.local`

4. **Get Google Maps API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Maps JavaScript API and Places API
   - Create an API key
   - Add it to `.env.local`

5. **Initialize the database:**
   ```bash
   npm run dev
   # Then visit: http://localhost:3000/api/init-db
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

7. **Open your browser:**
   - Navigate to `http://localhost:3000`
   - Enter the game password (from `.env.local`)
   - Start playing!

## 📦 Deployment to Vercel

1. **Install Vercel CLI (optional):**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set up environment variables in Vercel:**
   - Go to your project settings on Vercel
   - Add all environment variables from `.env.local`
   - Redeploy if necessary

4. **Initialize production database:**
   - Visit `https://your-domain.vercel.app/api/init-db`

## 🎯 How to Play

1. **Login**: Enter the game password
2. **Select Scenario**: Choose "Zombie Apocalypse" (more scenarios coming soon)
3. **Create Character**: 
   - Enter your character name
   - Roll or customize D&D stats (3-18 for each stat)
   - Stats affect survival chances
4. **Survive**: 
   - You start at a random location in Denver
   - Each turn, select a location within 20km
   - Choose to "Move" or "Loot" locations
   - Avoid zombie-infested areas (high population density = more zombies)
   - Survive 30 days to win!
5. **Game Over**: View your complete path and see where other players traveled

## 🎲 Game Mechanics

### Character Stats (D&D 5e Style)
- **Strength**: Physical power and melee combat
- **Dexterity**: Agility, reflexes, and dodge chance (affects survival rolls)
- **Constitution**: Health, stamina, and survival (affects survival rolls)
- **Intelligence**: Problem solving and planning
- **Wisdom**: Awareness and decision making
- **Charisma**: Leadership and negotiation

### Zombie Encounters
- **Low Density Areas**: DC 8, 10% encounter chance
- **Medium Density Areas**: DC 12, 30% encounter chance (stores, restaurants)
- **High Density Areas**: DC 16, 60% encounter chance (malls, hospitals, stadiums)

### Survival Roll
- Roll d20 + (DEX modifier + CON modifier) / 2
- Must meet or exceed DC to survive encounter

### Supply Gathering
Different locations yield different supplies:
- **Supermarkets**: Food, water, first aid, batteries
- **Pharmacies**: Medicine, bandages, pain relievers
- **Gas Stations**: Water, snacks, lighter
- **Hardware Stores**: Tools, rope, tape, knife
- And more!

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Vercel Postgres
- **Maps**: Google Maps JavaScript API
- **Authentication**: Iron Session (cookie-based)
- **Hosting**: Vercel

## 📁 Project Structure

```
apocalypse-survival/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── game/         # Game logic endpoints
│   │   └── init-db/      # Database initialization
│   ├── components/       # React components
│   │   ├── LoginForm.tsx
│   │   ├── ScenarioSelector.tsx
│   │   ├── CharacterCreator.tsx
│   │   ├── GameMap.tsx
│   │   └── GameRecap.tsx
│   ├── game/[gameId]/    # Game page (dynamic route)
│   ├── select-scenario/  # Scenario selection page
│   ├── create-character/ # Character creation page
│   └── layout.tsx        # Root layout
├── lib/
│   ├── db.ts            # Database operations
│   ├── game-logic.ts    # Game mechanics and rules
│   └── session.ts       # Session management
├── .env.example         # Environment variables template
└── README.md
```

## 🔮 Future Enhancements

- [ ] Additional catastrophe scenarios (Nuclear Fallout, Pandemic, Alien Invasion)
- [ ] Multiple city options (New York, Los Angeles, London, Tokyo)
- [ ] Player vs Player interactions
- [ ] More complex skill checks and stat usage
- [ ] Weapon and equipment system
- [ ] NPC encounters
- [ ] Real-time multiplayer features
- [ ] Achievements and leaderboards
- [ ] Mobile app version

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📝 License

MIT License - Feel free to use this project for learning or personal purposes.

## 🎮 Game Tips

1. **Avoid High-Density Areas Early**: Build up supplies first
2. **High DEX/CON**: These stats are crucial for survival
3. **Gather Supplies Early**: Visit stores and gas stations in low-density areas
4. **Plan Your Route**: Think ahead about where you'll go each day
5. **20km Limit**: Use your full daily travel distance wisely

## 🐛 Troubleshooting

### Database Issues
- Make sure you've run `/api/init-db` after deployment
- Check that all Postgres environment variables are set correctly

### Google Maps Not Loading
- Verify your API key is correct
- Ensure Maps JavaScript API and Places API are enabled
- Check that billing is enabled in Google Cloud Console

### Session/Login Issues
- Ensure `SESSION_SECRET` is at least 32 characters
- Clear browser cookies and try again

---

**Have fun surviving the apocalypse! 🧟‍♂️💀🎮**
