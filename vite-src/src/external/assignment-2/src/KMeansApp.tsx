// src/KMeansApp.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Point, Centroid } from './types';
import { KMeans, InitializationMethod } from './kmeans';
import ControlPanel from './components/ControlPanel';
import Visualization from './components/Visualization';
import Legend from './components/Legend';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './KMeansApp.css';

const KMeansApp: React.FC = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [kmeans, setKMeans] = useState<KMeans | null>(null);
  const [initializationMethod, setInitializationMethod] = useState<InitializationMethod>(
    InitializationMethod.Random
  );
  const [k, setK] = useState<number>(3);
  const [manualCentroids, setManualCentroids] = useState<Centroid[]>([]);
  const [centroids, setCentroids] = useState<Centroid[]>([]);
  const [iteration, setIteration] = useState(0);
  const [converged, setConverged] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [numPoints, setNumPoints] = useState<number>(200);
  const [distribution, setDistribution] = useState<string>('uniform');

  const intervalRef = useRef<number | null>(null);

  // Initialize the dataset and KMeans on component mount
  useEffect(() => {
    handleNewDataset();
  }, []);

  const initializeKMeans = (currentPoints: Point[]) => {
    if (initializationMethod === InitializationMethod.Manual) return;

    if (k <= 0) {
      toast.error('Number of clusters (k) must be at least 1.');
      return;
    }
    const km = new KMeans(k, currentPoints, initializationMethod);
    km.initializeCentroids();
    setKMeans(km);
    setIteration(0);
    setConverged(false);
    setCentroids([...km.getCentroids()]);
  };

  const handleInitializationMethodChange = (method: InitializationMethod) => {
    setInitializationMethod(method);
    if (method !== InitializationMethod.Manual && k === 0) {
      setK(3);
    } else if (method === InitializationMethod.Manual) {
      setK(0);
      setManualCentroids([]);
      setCentroids([]);
      setKMeans(null);
    }
  };

  // Reinitialize KMeans when the initialization method or k changes
  useEffect(() => {
    if (points.length === 0) return;
    initializeKMeans(points);
  }, [initializationMethod, k]);

  const handleNewDataset = () => {
    const newPoints = generateRandomPoints(numPoints, distribution);
    setPoints(newPoints);
    initializeKMeans(newPoints);
    setIteration(0);
    toast.info('New dataset generated. KMeans reinitialized.');
  };

  const handleStep = () => {
    if (kmeans && !converged) {
      const hasConverged = kmeans.iterate();
      setIteration((prev) => prev + 1);
      setPoints([...kmeans.getPoints()]);
      setCentroids([...kmeans.getCentroids()]);
      if (hasConverged) {
        setConverged(true);
        toast.success('KMeans has converged!');
      }
    } else if (converged) {
      toast.info('KMeans has already converged.');
    } else {
      toast.error('Please generate a dataset first.');
    }
  };

  const handleConverge = () => {
    if (kmeans && !converged) {
      let iterations = 0;
      let hasConverged = false;
      for (let i = 0; i < 100; i++) {
        hasConverged = kmeans.iterate();
        iterations++;
        if (hasConverged) {
          setConverged(true);
          toast.success(`KMeans has converged in ${iterations} iterations!`);
          break;
        }
      }
      if (!hasConverged) {
        toast.info('Maximum iterations reached without convergence.');
      }
      setIteration((prev) => prev + iterations);
      setPoints([...kmeans.getPoints()]);
      setCentroids([...kmeans.getCentroids()]);
    } else if (converged) {
      toast.info('KMeans has already converged.');
    } else {
      toast.error('Please generate a dataset first.');
    }
  };

  const handlePlay = () => {
    if (!kmeans || converged) {
      toast.error('Please generate a dataset first.');
      return;
    }
    setIsPlaying(true);
    intervalRef.current = window.setInterval(() => {
      const hasConverged = kmeans.iterate();
      setIteration((prev) => prev + 1);
      setPoints([...kmeans.getPoints()]);
      setCentroids([...kmeans.getCentroids()]);
      if (hasConverged) {
        setConverged(true);
        toast.success('KMeans has converged!');
        handlePause();
      }
    }, 500);
  };

  const handlePause = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleReset = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setConverged(false);
    setIteration(0);

    const resetPoints = points.map((point) => ({ x: point.x, y: point.y }));
    setPoints(resetPoints);

    if (initializationMethod === InitializationMethod.Manual) {
      setKMeans(null);
      setManualCentroids([]);
      setCentroids([]);
    } else {
      initializeKMeans(resetPoints);
    }

    toast.info('Algorithm reset.');
  };

  const handleCentroidAdd = (centroid: Centroid) => {
    const newCentroids = [...manualCentroids, centroid];
    setManualCentroids(newCentroids);
    setCentroids(newCentroids);

    const km = new KMeans(newCentroids.length, points, InitializationMethod.Manual);
    km.centroids = newCentroids;
    setKMeans(km);
    setIteration(0);
    setConverged(false);
  };

  return (
    <div className="kmeans-app min-h-screen bg-gray-900 p-4">
      <div className="container mx-auto text-black">
        <h1 className="text-4xl font-bold text-center mb-6 text-white">KMeans Clustering Visualization</h1>
        <ControlPanel
          initializationMethod={initializationMethod}
          onInitializationMethodChange={handleInitializationMethodChange}
          onNewDataset={handleNewDataset}
          onStep={handleStep}
          onConverge={handleConverge}
          onReset={handleReset}
          onPlay={handlePlay}
          onPause={handlePause}
          isPlaying={isPlaying}
          k={k}
          setK={setK}
          manualCentroids={manualCentroids}
          numPoints={numPoints}
          setNumPoints={setNumPoints}
          distribution={distribution}
          setDistribution={setDistribution}
        />
        <div className="text-center mb-4">
          <p className="text-lg font-semibold">Iteration: {iteration}</p>
        </div>
        <Visualization
          points={points}
          centroids={centroids.length > 0 ? centroids : manualCentroids}
          onCentroidAdd={handleCentroidAdd}
          initializationMethod={initializationMethod}
        />
        {kmeans && <Legend k={centroids.length} />}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </div>
    </div>
  );
};

function generateRandomPoints(numPoints: number, distribution: string): Point[] {
  const points: Point[] = [];
  if (distribution === 'uniform') {
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random(),
        y: Math.random(),
      });
    }
  } else if (distribution === 'gaussian') {
    // Generate Gaussian clusters
    const clusters = 3;
    const clusterCenters = [
      { x: 0.3, y: 0.3 },
      { x: 0.7, y: 0.3 },
      { x: 0.5, y: 0.7 },
    ];
    for (let i = 0; i < numPoints; i++) {
      const center = clusterCenters[i % clusters];
      points.push({
        x: randomGaussian(center.x, 0.05),
        y: randomGaussian(center.y, 0.05),
      });
    }
  }
  return points;
}

function randomGaussian(mean: number, stdDev: number): number {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); // Converting [0,1) to (0,1]
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num * stdDev + mean;
  return Math.min(Math.max(num, 0), 1);
}

export default KMeansApp;
