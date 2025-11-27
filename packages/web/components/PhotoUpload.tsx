'use client'

import { useRef } from 'react'
import Image from 'next/image'

interface PhotoUploadProps {
  photos: File[]
  setPhotos: (photos: File[]) => void
  maxPhotos: number
}

export default function PhotoUpload({ photos, setPhotos, maxPhotos }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => file.type.startsWith('image/'))

    const newPhotos = [...photos, ...validFiles].slice(0, maxPhotos)
    setPhotos(newPhotos)
  }

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Area */}
      {photos.length < maxPhotos && (
        <div
          onClick={handleClick}
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition mb-6"
        >
          <div className="text-6xl mb-4">📸</div>
          <h3 className="text-lg font-medium mb-2">Click to upload photos</h3>
          <p className="text-gray-500 text-sm">
            Upload up to {maxPhotos} photos (JPG, PNG, HEIC)
          </p>
          <p className="text-gray-400 text-xs mt-2">
            {photos.length} of {maxPhotos} uploaded
          </p>
        </div>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div>
          <h3 className="font-medium mb-4">Uploaded Photos ({photos.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative aspect-square group">
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Baby photo ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  ×
                </button>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {photo.name}
                </div>
              </div>
            ))}
          </div>

          {photos.length < maxPhotos && (
            <button
              onClick={handleClick}
              className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition"
            >
              + Add More Photos
            </button>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Tips for best results:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use well-lit photos with clear facial features</li>
          <li>• Avoid blurry or low-resolution images</li>
          <li>• Front-facing photos work best</li>
          <li>• Remove hats or accessories that cover the face</li>
        </ul>
      </div>
    </div>
  )
}
