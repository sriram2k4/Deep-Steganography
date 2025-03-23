import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react'

interface UploadFormProps {
  onResult: (data: any) => void
  setLoading: (loading: boolean) => void
}

const UploadForm: React.FC<UploadFormProps> = ({ onResult, setLoading }) => {
  const [cover, setCover] = useState<File | null>(null)
  const [secret, setSecret] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [secretPreview, setSecretPreview] = useState<string | null>(null)

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCover(file)
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  const handleSecretChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSecret(file)
      setSecretPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!cover || !secret) {
      alert('Please select both images')
      return
    }
    setLoading(true)
    const formData = new FormData()
    formData.append('cover', cover)
    formData.append('secret', secret)

    try {
      const res = await fetch('http://localhost:8000/process', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await res.json()
      onResult(data)
    } catch (error) {
      console.error('Error:', error)
      alert('Error processing images. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Clean up the created object URLs when the component unmounts or files change.
  useEffect(() => {
    return () => {
      coverPreview && URL.revokeObjectURL(coverPreview)
      secretPreview && URL.revokeObjectURL(secretPreview)
    }
  }, [coverPreview, secretPreview])

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Cover Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverChange}
          className="w-full text-gray-700 py-2 px-3 border rounded focus:outline-none focus:shadow-outline"
        />
        {coverPreview && (
          <div className="mt-2">
            <img src={coverPreview} alt="Cover Preview" className="max-w-full rounded" />
            <p className="text-sm text-gray-500 text-center">Cover Image</p>
          </div>
        )}
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Secret Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleSecretChange}
          className="w-full text-gray-700 py-2 px-3 border rounded focus:outline-none focus:shadow-outline"
        />
        {secretPreview && (
          <div className="mt-2">
            <img src={secretPreview} alt="Secret Preview" className="max-w-full rounded" />
            <p className="text-sm text-gray-500 text-center">Secret Image</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Process Images
        </button>
      </div>
    </form>
  )
}

export default UploadForm
