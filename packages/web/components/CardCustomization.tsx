'use client'

interface CardCustomizationProps {
  customization: {
    babyName: string
    jerseyNumber: string
    teamColors: { primary: string; secondary: string }
  }
  setCustomization: (customization: any) => void
}

const popularTeamColors = [
  { name: 'Blue & White', primary: '#1E40AF', secondary: '#FFFFFF' },
  { name: 'Red & Gold', primary: '#DC2626', secondary: '#FCD34D' },
  { name: 'Green & White', primary: '#059669', secondary: '#FFFFFF' },
  { name: 'Orange & Blue', primary: '#EA580C', secondary: '#2563EB' },
  { name: 'Purple & Yellow', primary: '#7C3AED', secondary: '#FDE047' },
  { name: 'Black & Silver', primary: '#000000', secondary: '#C0C0C0' },
]

export default function CardCustomization({
  customization,
  setCustomization,
}: CardCustomizationProps) {
  return (
    <div className="space-y-6">
      {/* Baby Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Baby's Name
        </label>
        <input
          type="text"
          value={customization.babyName}
          onChange={(e) =>
            setCustomization({ ...customization, babyName: e.target.value })
          }
          placeholder="e.g., SMITH"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
          maxLength={20}
        />
        <p className="text-sm text-gray-500 mt-1">
          This will appear on the trading card
        </p>
      </div>

      {/* Jersey Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jersey Number
        </label>
        <input
          type="number"
          value={customization.jerseyNumber}
          onChange={(e) =>
            setCustomization({
              ...customization,
              jerseyNumber: e.target.value,
            })
          }
          min="0"
          max="99"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Team Colors */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Team Colors
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {popularTeamColors.map((colors, index) => (
            <div
              key={index}
              onClick={() =>
                setCustomization({
                  ...customization,
                  teamColors: { primary: colors.primary, secondary: colors.secondary },
                })
              }
              className={`border-2 rounded-lg p-3 cursor-pointer transition ${
                customization.teamColors.primary === colors.primary
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: colors.primary }}
                />
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: colors.secondary }}
                />
              </div>
              <p className="text-xs font-medium">{colors.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Or Choose Custom Colors
        </label>
        <div className="flex gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Primary</label>
            <input
              type="color"
              value={customization.teamColors.primary}
              onChange={(e) =>
                setCustomization({
                  ...customization,
                  teamColors: {
                    ...customization.teamColors,
                    primary: e.target.value,
                  },
                })
              }
              className="w-20 h-10 rounded border border-gray-300 cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Secondary</label>
            <input
              type="color"
              value={customization.teamColors.secondary}
              onChange={(e) =>
                setCustomization({
                  ...customization,
                  teamColors: {
                    ...customization.teamColors,
                    secondary: e.target.value,
                  },
                })
              }
              className="w-20 h-10 rounded border border-gray-300 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-medium mb-3">Preview</h4>
        <div
          className="w-48 h-64 mx-auto rounded-lg p-4 flex flex-col items-center justify-center text-white shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${customization.teamColors.primary} 0%, ${customization.teamColors.secondary} 100%)`,
          }}
        >
          <div className="text-5xl mb-4">👶</div>
          <div className="text-center">
            <p className="text-xl font-bold">
              {customization.babyName || 'NAME'}
            </p>
            <p className="text-lg mt-1">#{customization.jerseyNumber}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
