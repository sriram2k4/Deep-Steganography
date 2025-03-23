"use client"
import { useState } from 'react'
import UploadForm from '../components/UploadForm'
import ResultDisplay from '../components/ResultDisplay'

const Home = () => {
  const [result, setResult] = useState<null | {
    encoded_cover: string
    decoded_secret: string
    difference: string
  }>(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Image Steganography</h1>
      <UploadForm onResult={setResult} setLoading={setLoading} />
      {loading && (
        <div className="mt-4">
          <p className="text-gray-600">Processing images...</p>
        </div>
      )}
      {result && <ResultDisplay result={result} />}
      <footer className="mt-auto py-4">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} DeepSteg. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default Home
