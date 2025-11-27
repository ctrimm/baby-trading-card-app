'use client'

import { useState, useEffect } from 'react'

interface CardGenerationProps {
  photos: File[]
  sport: string
  customization: {
    babyName: string
    jerseyNumber: string
    teamColors: { primary: string; secondary: string }
  }
  sessionData: any
}

interface GeneratedCard {
  id: string
  imageUrl: string
  status: 'generating' | 'complete' | 'error'
}

export default function CardGeneration({
  photos,
  sport,
  customization,
  sessionData,
}: CardGenerationProps) {
  const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([])
  const [generating, setGenerating] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    startGeneration()
  }, [])

  const startGeneration = async () => {
    setGenerating(true)

    // Initialize cards array
    const initialCards = photos.map((_, index) => ({
      id: `card-${index}`,
      imageUrl: '',
      status: 'generating' as const,
    }))
    setGeneratedCards(initialCards)

    // Generate cards one by one
    for (let i = 0; i < photos.length; i++) {
      setCurrentIndex(i)
      try {
        const formData = new FormData()
        formData.append('photo', photos[i])
        formData.append('sport', sport)
        formData.append('babyName', customization.babyName)
        formData.append('jerseyNumber', customization.jerseyNumber)
        formData.append('primaryColor', customization.teamColors.primary)
        formData.append('secondaryColor', customization.teamColors.secondary)
        formData.append('sessionId', sessionData.id)

        const response = await fetch('/api/generate-card', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        if (data.success) {
          setGeneratedCards((prev) =>
            prev.map((card, index) =>
              index === i
                ? { ...card, imageUrl: data.imageUrl, status: 'complete' }
                : card
            )
          )
        } else {
          throw new Error(data.error)
        }
      } catch (error) {
        console.error('Error generating card:', error)
        setGeneratedCards((prev) =>
          prev.map((card, index) =>
            index === i ? { ...card, status: 'error' } : card
          )
        )
      }
    }

    setGenerating(false)
  }

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `baby-sports-card-${index + 1}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading:', error)
    }
  }

  const handleDownloadAll = () => {
    generatedCards.forEach((card, index) => {
      if (card.status === 'complete') {
        setTimeout(() => handleDownload(card.imageUrl, index), index * 500)
      }
    })
  }

  const completedCards = generatedCards.filter((c) => c.status === 'complete').length

  return (
    <div>
      {/* Progress */}
      {generating && (
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-blue-900">
              Generating your cards...
            </h3>
            <span className="text-blue-700 font-bold">
              {completedCards} of {photos.length}
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(completedCards / photos.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-blue-700 mt-2">
            This may take a few minutes. Please don't close this page.
          </p>
        </div>
      )}

      {/* Completed Message */}
      {!generating && completedCards === photos.length && (
        <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎉</div>
            <div>
              <h3 className="font-bold text-green-900">
                All cards generated successfully!
              </h3>
              <p className="text-green-700 text-sm">
                Download your cards below or order prints.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {completedCards > 0 && (
        <div className="mb-6 flex gap-4">
          <button
            onClick={handleDownloadAll}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition"
          >
            Download All Cards
          </button>
          <button
            onClick={() => (window.location.href = '/order')}
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition"
          >
            Order Prints
          </button>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {generatedCards.map((card, index) => (
          <div
            key={card.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="aspect-[3/4] bg-gray-100 relative">
              {card.status === 'generating' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Generating...</p>
                  </div>
                </div>
              )}

              {card.status === 'complete' && (
                <img
                  src={card.imageUrl}
                  alt={`Generated card ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}

              {card.status === 'error' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-red-600">
                    <div className="text-4xl mb-2">⚠️</div>
                    <p>Generation failed</p>
                  </div>
                </div>
              )}
            </div>

            {card.status === 'complete' && (
              <div className="p-4">
                <button
                  onClick={() => handleDownload(card.imageUrl, index)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded font-medium transition"
                >
                  Download
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
