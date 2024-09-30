import React from 'react';
import { InitializationMethod } from '../kmeans';
import { FaPlay, FaPause, FaStepForward, FaFastForward, FaSyncAlt, FaRedo } from 'react-icons/fa';

interface ControlPanelProps {
  initializationMethod: InitializationMethod;
  onInitializationMethodChange: (method: InitializationMethod) => void;
  onNewDataset: () => void;
  onStep: () => void;
  onConverge: () => void;
  onReset: () => void;
  onPlay: () => void;
  onPause: () => void;
  isPlaying: boolean;
  k: number;
  setK: (k: number) => void;
  manualCentroids: any[];
  numPoints: number;
  setNumPoints: (n: number) => void;
  distribution: string;
  setDistribution: (d: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  initializationMethod,
  onInitializationMethodChange,
  onNewDataset,
  onStep,
  onConverge,
  onReset,
  onPlay,
  onPause,
  isPlaying,
  k,
  setK,
  manualCentroids,
  numPoints,
  setNumPoints,
  distribution,
  setDistribution,
}) => {
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-3xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <label htmlFor="numPoints" className="font-semibold text-gray-700">
              Number of Points:
            </label>
            <input
              type="number"
              id="numPoints"
              value={numPoints}
              onChange={e => setNumPoints(Number(e.target.value))}
              className="border rounded px-2 py-1 w-24"
              min={10}
            />
          </div>
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <label htmlFor="distribution" className="font-semibold text-gray-700">
              Distribution:
            </label>
            <select
              id="distribution"
              value={distribution}
              onChange={e => setDistribution(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="uniform">Uniform</option>
              <option value="gaussian">Gaussian</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <label htmlFor="k" className="font-semibold text-gray-700">
              Number of Clusters (k):
            </label>
            <input
              type="number"
              id="k"
              value={initializationMethod === InitializationMethod.Manual ? manualCentroids.length : k}
              onChange={e => setK(Number(e.target.value))}
              className="border rounded px-2 py-1 w-20"
              min={1}
              disabled={initializationMethod === InitializationMethod.Manual}
            />
          </div>
          <div className="flex items-center space-x-4">
            <label htmlFor="initMethod" className="font-semibold text-gray-700">
              Initialization Method:
            </label>
            <select
              id="initMethod"
              value={initializationMethod}
              onChange={e => onInitializationMethodChange(e.target.value as InitializationMethod)}
              className="border rounded px-2 py-1"
            >
              {Object.values(InitializationMethod).map(method => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
        </div>
        {initializationMethod === InitializationMethod.Manual && (
        <p className="text-sm text-gray-600">
          Click on the visualization to add centroids. Added Centroids: {manualCentroids.length}
        </p>
        )}
        <div className="flex flex-wrap justify-center space-x-4">
          <button
            onClick={onNewDataset}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200 mb-2 flex items-center"
          >
            <FaSyncAlt className="mr-2" />
            New Dataset
          </button>
          <button
            onClick={onStep}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors duration-200 mb-2 flex items-center"
          >
            <FaStepForward className="mr-2" />
            Step
          </button>
          {!isPlaying ? (
            <button
              onClick={onPlay}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors duration-200 mb-2 flex items-center"
            >
              <FaPlay className="mr-2" />
              Play
            </button>
          ) : (
            <button
              onClick={onPause}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors duration-200 mb-2 flex items-center"
            >
              <FaPause className="mr-2" />
              Pause
            </button>
          )}
          <button
            onClick={onConverge}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200 mb-2 flex items-center"
          >
            <FaFastForward className="mr-2" />
            Converge
          </button>
          
          <button
            onClick={onReset}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200 mb-2 flex items-center"
          >
            <FaRedo className="mr-2" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
