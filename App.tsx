
import React, { useState, useCallback } from 'react';
import { editImageWithPrompt } from './services/geminiService';
import { fileToBase64 } from './utils/imageUtils';

import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import Spinner from './components/Spinner';

// Define a safe list of example prompts
const examplePrompts = [
  "Add a stylish black leather jacket.",
  "Change the t-shirt to a Hawaiian shirt.",
  "Give them a futuristic silver sci-fi suit.",
  "Add a cozy knitted sweater.",
  "Change the dress to a formal evening gown."
];

function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setImageFile(file);
    setResultImage(null);
    setError(null);
    try {
      const base64 = await fileToBase64(file);
      setImageBase64(base64);
    } catch (err) {
      setError('Failed to read image file.');
      setImageBase64(null);
    }
  }, []);

  const handleGenerate = async () => {
    if (!imageBase64 || !prompt) {
      setError('Please upload an image and enter a style description.');
      return;
    }
    
    // Safety check for harmful prompts. This is a client-side check;
    // the Gemini API has its own robust safety filters.
    const forbiddenWords = ['undress', 'remove', 'nude', 'naked', 'disrobe'];
    if (forbiddenWords.some(word => prompt.toLowerCase().includes(word))) {
        setError('Inappropriate request. This app is for creative styling only.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const editedImage = await editImageWithPrompt(imageBase64, prompt);
      setResultImage(editedImage);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExamplePrompt = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-5xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          AI Virtual Stylist
        </h1>
        <p className="mt-2 text-gray-400">
          Upload a photo and describe a new outfit to see the magic happen!
        </p>
        <p className="mt-1 text-xs text-yellow-500 bg-yellow-900/20 p-2 rounded-md">
            Warning: This tool is for creative purposes only. Requests to remove clothing or generate inappropriate content are strictly forbidden and will be blocked.
        </p>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Controls */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
          <ImageUploader onFileSelect={handleFileSelect} currentImage={imageBase64} />
          
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
              2. Describe the Style Change
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Add a cool denim jacket' or 'Change the shirt to red'"
              className="w-full h-24 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              rows={3}
              disabled={!imageBase64}
            />
          </div>

          <div className="flex flex-wrap gap-2">
              {examplePrompts.map(p => (
                  <button 
                      key={p}
                      onClick={() => handleExamplePrompt(p)}
                      disabled={!imageBase64}
                      className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed">
                      {p}
                  </button>
              ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !imageBase64 || !prompt}
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {isLoading ? <Spinner /> : '✨ Generate New Look'}
          </button>
          
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
        </div>

        {/* Right Column: Result */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center justify-center">
          <ResultDisplay isLoading={isLoading} resultImage={resultImage} />
        </div>
      </main>
    </div>
  );
}

export default App;
