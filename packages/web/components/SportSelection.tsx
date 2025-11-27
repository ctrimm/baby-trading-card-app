'use client'

interface SportSelectionProps {
  selectedSport: string
  setSelectedSport: (sport: string) => void
  planId: string
}

const sports = [
  {
    id: 'football',
    name: 'Football',
    icon: '🏈',
    description: 'NFL-style trading card',
    availableIn: ['starter', 'pro', 'ultimate'],
  },
  {
    id: 'basketball',
    name: 'Basketball',
    icon: '🏀',
    description: 'NBA-style trading card',
    availableIn: ['pro', 'ultimate'],
  },
  {
    id: 'baseball',
    name: 'Baseball',
    icon: '⚾',
    description: 'MLB-style trading card',
    availableIn: ['pro', 'ultimate'],
  },
  {
    id: 'soccer',
    name: 'Soccer',
    icon: '⚽',
    description: 'FIFA-style trading card',
    availableIn: ['pro', 'ultimate'],
  },
  {
    id: 'hockey',
    name: 'Hockey',
    icon: '🏒',
    description: 'NHL-style trading card',
    availableIn: ['ultimate'],
  },
  {
    id: 'tennis',
    name: 'Tennis',
    icon: '🎾',
    description: 'Professional tennis card',
    availableIn: ['ultimate'],
  },
]

export default function SportSelection({
  selectedSport,
  setSelectedSport,
  planId,
}: SportSelectionProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {sports.map((sport) => {
        const isAvailable = sport.availableIn.includes(planId)

        return (
          <div
            key={sport.id}
            onClick={() => isAvailable && setSelectedSport(sport.id)}
            className={`relative border-2 rounded-lg p-6 text-center cursor-pointer transition ${
              isAvailable
                ? selectedSport === sport.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
            }`}
          >
            {!isAvailable && (
              <div className="absolute top-2 right-2 bg-gray-600 text-white text-xs px-2 py-1 rounded">
                Premium
              </div>
            )}

            <div className="text-5xl mb-3">{sport.icon}</div>
            <h3 className="font-bold mb-1">{sport.name}</h3>
            <p className="text-sm text-gray-600">{sport.description}</p>

            {selectedSport === sport.id && (
              <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                ✓
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
