'use client'

import { useState, useRef, useEffect } from 'react'

export default function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = (x / rect.width) * 100

    setSliderPosition(Math.min(Math.max(percentage, 0), 100))
  }

  const handleMouseDown = () => setIsDragging(true)

  const handleMouseUp = () => setIsDragging(false)

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return
    handleMove(e.touches[0].clientX)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging])

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/5] max-w-md mx-auto overflow-hidden rounded-lg shadow-2xl select-none cursor-ew-resize"
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* After Image (Sports Card) - Full width */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <div className="w-48 h-48 mx-auto mb-4 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-6xl">🏈</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">BABY SMITH</h3>
            <p className="text-lg">#1 QUARTERBACK</p>
            <div className="mt-4 text-sm opacity-80">
              <p>ROOKIE CARD</p>
              <p>2024 SEASON</p>
            </div>
          </div>
        </div>
      </div>

      {/* Before Image (Original Baby Photo) - Clipped */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-6xl">👶</span>
            </div>
            <p className="text-gray-600 font-medium">Original Baby Photo</p>
          </div>
        </div>
      </div>

      {/* Slider Line & Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        {/* Slider Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center cursor-ew-resize">
          <div className="flex gap-1">
            <div className="w-0.5 h-4 bg-gray-400"></div>
            <div className="w-0.5 h-4 bg-gray-400"></div>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm font-medium">
        Before
      </div>
      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm font-medium">
        After
      </div>
    </div>
  )
}
