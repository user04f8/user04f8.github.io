import React from 'react';
import { Point, Centroid } from '../types';
import { InitializationMethod } from '../kmeans';
import {colors} from './Colors'

interface VisualizationProps {
  points: Point[];
  centroids: Centroid[];
  onCentroidAdd?: (centroid: Centroid) => void;
  initializationMethod: InitializationMethod;
}

const Visualization: React.FC<VisualizationProps> = ({
  points,
  centroids,
  onCentroidAdd,
  initializationMethod,
}) => {
  const padding = 40;

  const handleClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (initializationMethod !== InitializationMethod.Manual || !onCentroidAdd) return;

    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const scaleX = 600 / rect.width;
    const scaleY = 600 / rect.height;
    const x = (event.clientX - rect.left - padding) * scaleX;
    const y = (event.clientY - rect.top - padding) * scaleY;

    onCentroidAdd({ x: x / (600 - 2 * padding), y: y / (600 - 2 * padding) });
  };

  return (
    <div className="flex justify-center items-center w-full">
      <svg
        viewBox="0 0 600 600"
        className="border border-gray-400 w-full h-auto max-w-3xl bg-white rounded-lg shadow-md"
        onClick={handleClick}
      >
        {/* Background */}
        <rect width="600" height="600" fill="white" />

        {/* Data Points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={padding + point.x * (600 - 2 * padding)}
            cy={padding + point.y * (600 - 2 * padding)}
            r={4}
            fill={point.cluster !== undefined ? colors[point.cluster % colors.length] : '#aaaaaa'}
          />
        ))}

        {/* Centroids */}
        {centroids.map((centroid, index) => (
          <circle
            key={index}
            className="centroid"
            cx={padding + centroid.x * (600 - 2 * padding)}
            cy={padding + centroid.y * (600 - 2 * padding)}
            r={10}
            fill={colors[index % colors.length]}
            stroke="#000"
            strokeWidth={2}
          />
        ))}
      </svg>
    </div>
  );
};

export default Visualization;
