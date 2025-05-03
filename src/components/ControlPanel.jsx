import React from 'react';

export default function ControlPanel({ onReturnHome, onLand, onPause, isPaused }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Controls</h2>
      <div className="flex flex-col space-y-2">
        <button
          onClick={onReturnHome}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Return Home
        </button>
        <button
          onClick={onLand}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Land
        </button>
        <button
          onClick={onPause}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          {isPaused ? 'Resume Mission' : 'Pause Mission'}
        </button>
      </div>
    </div>
  );
}
