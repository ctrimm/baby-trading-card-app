'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PhotoUpload from '@/components/PhotoUpload'
import SportSelection from '@/components/SportSelection'
import CardCustomization from '@/components/CardCustomization'
import CardGeneration from '@/components/CardGeneration'

function CreateContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [step, setStep] = useState(1)
  const [sessionData, setSessionData] = useState<any>(null)
  const [photos, setPhotos] = useState<File[]>([])
  const [selectedSport, setSelectedSport] = useState<string>('')
  const [customization, setCustomization] = useState({
    babyName: '',
    jerseyNumber: '1',
    teamColors: { primary: '#1E40AF', secondary: '#FFFFFF' },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      fetchSessionData()
    }
  }, [sessionId])

  const fetchSessionData = async () => {
    try {
      const response = await fetch(`/api/session?session_id=${sessionId}`)
      const data = await response.json()
      setSessionData(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching session:', error)
      setLoading(false)
    }
  }

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your session...</p>
        </div>
      </div>
    )
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Session Not Found</h1>
          <p className="text-gray-600 mb-4">
            We couldn't find your session. Please check your email for the unique link.
          </p>
          <a href="/" className="text-blue-500 hover:underline">
            Return to Home
          </a>
        </div>
      </div>
    )
  }

  const totalSteps = 4

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-600">
              Step {step} of {totalSteps}
            </h2>
            <div className="text-sm text-gray-600">
              {sessionData.creditsRemaining} credits remaining
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {step === 1 && (
            <div>
              <h1 className="text-3xl font-bold mb-4">Upload Baby Photos</h1>
              <p className="text-gray-600 mb-6">
                Upload clear photos of your baby. The better the photo quality, the better the results!
              </p>
              <PhotoUpload photos={photos} setPhotos={setPhotos} maxPhotos={sessionData.credits} />
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={photos.length === 0}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-3xl font-bold mb-4">Choose a Sport</h1>
              <p className="text-gray-600 mb-6">
                Select which sport you'd like for your baby's trading card.
              </p>
              <SportSelection
                selectedSport={selectedSport}
                setSelectedSport={setSelectedSport}
                planId={sessionData.planId}
              />
              <div className="mt-6 flex justify-between">
                <button
                  onClick={handleBack}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!selectedSport}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="text-3xl font-bold mb-4">Customize Your Card</h1>
              <p className="text-gray-600 mb-6">
                Add personal touches to make the card uniquely yours.
              </p>
              <CardCustomization
                customization={customization}
                setCustomization={setCustomization}
              />
              <div className="mt-6 flex justify-between">
                <button
                  onClick={handleBack}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!customization.babyName}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Generate Cards
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h1 className="text-3xl font-bold mb-4">Your Sports Cards</h1>
              <CardGeneration
                photos={photos}
                sport={selectedSport}
                customization={customization}
                sessionData={sessionData}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    }>
      <CreateContent />
    </Suspense>
  )
}
