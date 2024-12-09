import React, { useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { FaSpinner } from 'react-icons/fa';

Chart.register(...registerables);

function LogisticRegressionExperiment() {
  const [start, setStart] = useState<number>(0.25);
  const [end, setEnd] = useState<number>(2.0);
  const [stepNum, setStepNum] = useState<number>(8);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [plotsData, setPlotsData] = useState<any[]>([]);
  const [parametersData, setParametersData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await runExperiments(start, end, stepNum);
    setIsLoading(false);
  };

  const runExperiments = async (start: number, end: number, stepNum: number) => {
    const shiftDistances = linspace(start, end, stepNum);
    const beta0List: number[] = [];
    const beta1List: number[] = [];
    const beta2List: number[] = [];
    const slopeList: number[] = [];
    const interceptList: number[] = [];
    const lossList: number[] = [];
    const marginWidths: number[] = [];
    const plots: any[] = [];

    for (let distance of shiftDistances) {
      const { X, y } = generateEllipsoidClusters(distance, 100);
      const { beta0, beta1, beta2, loss } = fitLogisticRegression(X, y);
      beta0List.push(beta0);
      beta1List.push(beta1);
      beta2List.push(beta2);

      const slope = -beta1 / beta2;
      const intercept = -beta0 / beta2;
      slopeList.push(slope);
      interceptList.push(intercept);
      lossList.push(loss);

      // Margin width calculation can be complex; for simplicity, we'll use the distance between cluster means
      const marginWidth = distance;
      marginWidths.push(marginWidth);

      // Prepare data for plotting
      plots.push({
        distance,
        data: {
          datasets: [
            {
              label: 'Class 0',
              data: X.filter((_, idx) => y[idx] === 0).map((point) => ({ x: point[0], y: point[1] })),
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
              label: 'Class 1',
              data: X.filter((_, idx) => y[idx] === 1).map((point) => ({ x: point[0], y: point[1] })),
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
            {
              label: 'Decision Boundary',
              data: [
                { x: -5, y: slope * -5 + intercept },
                { x: 5, y: slope * 5 + intercept },
              ],
              type: 'line' as const,
              borderColor: 'rgba(0, 255, 0, 0.8)',
              borderWidth: 2,
              fill: false,
              pointRadius: 0,
            },
          ],
        },
      });
    }

    // Prepare parameters data for plotting
    setParametersData({
      shiftDistances,
      beta0List,
      beta1List,
      beta2List,
      slopeList,
      interceptList,
      lossList,
      marginWidths,
    });

    setPlotsData(plots);
  };

  // Utility functions
  function linspace(start: number, end: number, num: number) {
    const arr = [];
    const step = (end - start) / (num - 1);
    for (let i = 0; i < num; i++) {
      arr.push(start + step * i);
    }
    return arr;
  }

  function generateEllipsoidClusters(distance: number, nSamples: number) {
    const clusterStd = 0.5;
    const covarianceMatrix = [
      [clusterStd, clusterStd * 0.8],
      [clusterStd * 0.8, clusterStd],
    ];

    const mean1 = [1, 1];
    const mean2 = [1 + distance, 1 + distance];

    const X1 = multivariateNormal(mean1, covarianceMatrix, nSamples);
    const X2 = multivariateNormal(mean2, covarianceMatrix, nSamples);
    const y1 = Array(nSamples).fill(0);
    const y2 = Array(nSamples).fill(1);

    const X = [...X1, ...X2];
    const y = [...y1, ...y2];

    return { X, y };
  }

  function multivariateNormal(mean: number[], cov: number[][], n: number) {
    const result = [];
    const [a, b] = mean;
    const [s1, s2] = [Math.sqrt(cov[0][0]), Math.sqrt(cov[1][1])];
    for (let i = 0; i < n; i++) {
      const x = generateNormalRandom(a, s1);
      const y = generateNormalRandom(b, s2);
      result.push([x, y]);
    }
    return result;
  }

  function generateNormalRandom(mean: number, stdDev: number): number {
    let u = 0,
      v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  function fitLogisticRegression(X: number[][], y: number[]) {
    // Simple logistic regression using gradient descent
    const numIterations = 1000;
    const learningRate = 0.1;
    let beta0 = 0;
    let beta1 = 0;
    let beta2 = 0;

    for (let iter = 0; iter < numIterations; iter++) {
      let grad0 = 0;
      let grad1 = 0;
      let grad2 = 0;
      let loss = 0;

      for (let i = 0; i < X.length; i++) {
        const xi = X[i];
        const yi = y[i];
        const linearModel = beta0 + beta1 * xi[0] + beta2 * xi[1];
        const pi = 1 / (1 + Math.exp(-linearModel));
        loss += -yi * Math.log(pi + 1e-10) - (1 - yi) * Math.log(1 - pi + 1e-10);

        grad0 += (pi - yi);
        grad1 += (pi - yi) * xi[0];
        grad2 += (pi - yi) * xi[1];
      }

      beta0 -= (learningRate * grad0) / X.length;
      beta1 -= (learningRate * grad1) / X.length;
      beta2 -= (learningRate * grad2) / X.length;
    }

    // Compute final loss
    let finalLoss = 0;
    for (let i = 0; i < X.length; i++) {
      const xi = X[i];
      const yi = y[i];
      const linearModel = beta0 + beta1 * xi[0] + beta2 * xi[1];
      const pi = 1 / (1 + Math.exp(-linearModel));
      finalLoss += -yi * Math.log(pi + 1e-10) - (1 - yi) * Math.log(1 - pi + 1e-10);
    }
    finalLoss /= X.length;

    return { beta0, beta1, beta2, loss: finalLoss };
  }

  return (
    <div className="mt-6 p-6 bg-gray-800 text-white rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Logistic Regression Experiment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="start" className="block font-medium">
              Shift Start:
            </label>
            <input
              type="number"
              step="any"
              id="start"
              name="start"
              required
              className="input w-full p-2 rounded bg-gray-700 text-white"
              value={start}
              onChange={(e) => setStart(parseFloat(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="end" className="block font-medium">
              Shift End:
            </label>
            <input
              type="number"
              step="any"
              id="end"
              name="end"
              required
              className="input w-full p-2 rounded bg-gray-700 text-white"
              value={end}
              onChange={(e) => setEnd(parseFloat(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="stepNum" className="block font-medium">
              Number of Steps:
            </label>
            <input
              type="number"
              id="stepNum"
              name="stepNum"
              required
              className="input w-full p-2 rounded bg-gray-700 text-white"
              value={stepNum}
              onChange={(e) => setStepNum(parseInt(e.target.value))}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-4"
          disabled={isLoading}
        >
          {isLoading ? <FaSpinner className="animate-spin inline-block" /> : 'Run Experiment'}
        </button>
      </form>
      {plotsData.length > 0 && (
        <div className="results mt-8">
          <h2 className="text-xl font-semibold mt-6">Datasets and Decision Boundaries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plotsData.map((plot, idx) => (
              <div key={idx} className="mt-4">
                <h3 className="font-semibold mb-2">Shift Distance: {plot.distance.toFixed(2)}</h3>
                <Scatter
                  data={plot.data}
                  options={{
                    plugins: {
                      legend: { display: true, position: 'top' },
                    },
                    scales: {
                      x: { title: { display: true, text: 'x1' }, min: -2, max: 5 },
                      y: { title: { display: true, text: 'x2' }, min: -2, max: 5 },
                    },
                  }}
                />
              </div>
            ))}
          </div>

          {parametersData && (
            <>
              <h2 className="text-xl font-semibold mt-6">Parameters vs. Shift Distance</h2>
              <div className="mt-4">
                <Scatter
                  data={{
                    labels: parametersData.shiftDistances,
                    datasets: [
                      {
                        label: 'Beta0',
                        data: parametersData.shiftDistances.map((sd: number, idx: number) => ({
                          x: sd,
                          y: parametersData.beta0List[idx],
                        })),
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                      },
                      {
                        label: 'Beta1',
                        data: parametersData.shiftDistances.map((sd: number, idx: number) => ({
                          x: sd,
                          y: parametersData.beta1List[idx],
                        })),
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                      },
                      {
                        label: 'Beta2',
                        data: parametersData.shiftDistances.map((sd: number, idx: number) => ({
                          x: sd,
                          y: parametersData.beta2List[idx],
                        })),
                        backgroundColor: 'rgba(255, 206, 86, 0.6)',
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: { display: true, position: 'top' },
                    },
                    scales: {
                      x: { title: { display: true, text: 'Shift Distance' } },
                      y: { title: { display: true, text: 'Parameter Value' } },
                    },
                  }}
                />
              </div>

              <h2 className="text-xl font-semibold mt-6">Loss and Margin Width vs. Shift Distance</h2>
              <div className="mt-4">
                <Scatter
                  data={{
                    labels: parametersData.shiftDistances,
                    datasets: [
                      {
                        label: 'Loss',
                        data: parametersData.shiftDistances.map((sd: number, idx: number) => ({
                          x: sd,
                          y: parametersData.lossList[idx],
                        })),
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                      },
                      {
                        label: 'Margin Width',
                        data: parametersData.shiftDistances.map((sd: number, idx: number) => ({
                          x: sd,
                          y: parametersData.marginWidths[idx],
                        })),
                        backgroundColor: 'rgba(153, 102, 255, 0.6)',
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: { display: true, position: 'top' },
                    },
                    scales: {
                      x: { title: { display: true, text: 'Shift Distance' } },
                      y: { title: { display: true, text: 'Value' } },
                    },
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default LogisticRegressionExperiment;
