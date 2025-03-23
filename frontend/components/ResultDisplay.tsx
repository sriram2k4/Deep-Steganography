import React from 'react'

interface ResultDisplayProps {
  result: {
    encoded_cover: string
    decoded_secret: string
    difference: string
  }
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="mt-8 w-full max-w-4xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Results</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-medium text-gray-700">Encoded Cover</h3>
          <img
            src={`data:image/png;base64,${result.encoded_cover}`}
            alt="Encoded Cover"
            className="mt-2 rounded shadow-md max-w-full"
          />
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-medium text-gray-700">Decoded Secret</h3>
          <img
            src={`data:image/png;base64,${result.decoded_secret}`}
            alt="Decoded Secret"
            className="mt-2 rounded shadow-md max-w-full"
          />
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-medium text-gray-700">Difference</h3>
          <img
            src={`data:image/png;base64,${result.difference}`}
            alt="Difference"
            className="mt-2 rounded shadow-md max-w-full"
          />
        </div>
      </div>
    </div>
  )
}

export default ResultDisplay
