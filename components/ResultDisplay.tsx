
import React from 'react';
import Spinner from './Spinner.tsx';

interface ResultDisplayProps {
  isLoading: boolean;
  resultImage: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, resultImage }) => {
  return (
    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-gray-700/50 rounded-lg p-4">
      {isLoading && (
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <Spinner />
          <p>Generating your new look...</p>
        </div>
      )}
      {!isLoading && resultImage && (
        <img src={resultImage} alt="Generated result" className="max-w-full max-h-full object-contain rounded-lg" />
      )}
      {!isLoading && !resultImage && (
        <div className="text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          <p className="mt-2">Your generated image will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
