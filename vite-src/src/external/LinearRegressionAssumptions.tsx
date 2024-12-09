import React, { useState } from 'react';
import { Scatter, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

function LinearRegressionAssumptions() {
  const [N, setN] = useState<number>(100);
  const [mu, setMu] = useState<number>(0);
  const [sigma2, setSigma2] = useState<number>(1);
  const [S, setS] = useState<number>(1000);

  const [plotData1, setPlotData1] = useState<any>(null);
  const [plotData2, setPlotData2] = useState<any>(null);
  const [slopeExtreme, setSlopeExtreme] = useState<number>(0);
  const [interceptExtreme, setInterceptExtreme] = useState<number>(0);

  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generatePlots(N, mu, sigma2, S);
  };

  function randn_bm() {
    let u = 0,
      v = 0;
    while (u === 0) u = Math.random(); // Converting [0,1) to (0,1]
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  function generateNormalRandom(mean: number, stdDev: number): number {
    return mean + stdDev * randn_bm();
  }

  function linearRegression(x: number[], y: number[]) {
    // const n = x.length;
    const x_mean = mean(x);
    const y_mean = mean(y);
    const x_variance = variance(x, x_mean);
    const covariance_xy = covariance(x, y, x_mean, y_mean);
    const slope = covariance_xy / x_variance;
    const intercept = y_mean - slope * x_mean;
    return { slope, intercept };
  }

  function mean(data: number[]) {
    return data.reduce((a, b) => a + b, 0) / data.length;
  }

  function variance(data: number[], meanValue: number) {
    return data.reduce((sum, value) => sum + (value - meanValue) ** 2, 0) / data.length;
  }

  function covariance(x: number[], y: number[], x_mean: number, y_mean: number) {
    let cov = 0;
    for (let i = 0; i < x.length; i++) {
      cov += (x[i] - x_mean) * (y[i] - y_mean);
    }
    return cov / x.length;
  }

  function createHistogramData(data: number[], numBins: number) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / numBins;
    const bins = Array.from({ length: numBins }, (_, i) => min + i * binWidth);
    const counts = Array(numBins).fill(0);
    data.forEach(value => {
      let index = Math.floor((value - min) / binWidth);
      if (index === numBins) index--;
      counts[index]++;
    });
    return { bins, counts };
  }

  const generatePlots = (N: number, mu: number, sigma2: number, S: number) => {
    const X = Array.from({ length: N }, () => Math.random());
    const stdDev = Math.sqrt(sigma2);
    const Y = X.map(_ => generateNormalRandom(mu, stdDev));

    const { slope, intercept } = linearRegression(X, Y);

    const scatterData = {
      datasets: [
        {
          label: 'Data Points',
          data: X.map((x, i) => ({ x: x, y: Y[i] })),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
        {
          label: `Regression Line: Y = ${slope.toFixed(2)}X + ${intercept.toFixed(2)}`,
          data: [
            { x: Math.min(...X), y: slope * Math.min(...X) + intercept },
            { x: Math.max(...X), y: slope * Math.max(...X) + intercept },
          ],
          type: 'line' as const,
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          fill: false,
          pointRadius: 0,
        },
      ],
    };

    const slopes: number[] = [];
    const intercepts: number[] = [];
    for (let i = 0; i < S; i++) {
      const X_sim = Array.from({ length: N }, () => Math.random());
      const Y_sim = X_sim.map(x => x + generateNormalRandom(mu, stdDev));
      const { slope: sim_slope, intercept: sim_intercept } = linearRegression(X_sim, Y_sim);
      slopes.push(sim_slope);
      intercepts.push(sim_intercept);
    }

    const numBins = 20;
    const slopeHistogram = createHistogramData(slopes, numBins);
    const interceptHistogram = createHistogramData(intercepts, numBins);

    const slopeHistogramData = {
      labels: slopeHistogram.bins.map(bin => bin.toFixed(2)),
      datasets: [
        {
          label: 'Slopes',
          data: slopeHistogram.counts,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
      ],
    };

    const interceptHistogramData = {
      labels: interceptHistogram.bins.map(bin => bin.toFixed(2)),
      datasets: [
        {
          label: 'Intercepts',
          data: interceptHistogram.counts,
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
        },
      ],
    };

    const slope_more_extreme = (slopes.filter(s => Math.abs(s) > Math.abs(slope)).length / S) * 100;
    const intercept_more_extreme = (intercepts.filter(i => Math.abs(i) > Math.abs(intercept)).length / S) * 100;

    setPlotData1(scatterData);
    setPlotData2({ slopeHistogramData, interceptHistogramData });
    setSlopeExtreme(slope_more_extreme);
    setInterceptExtreme(intercept_more_extreme);
    setSubmitted(true);
  };

  return (
    <div className="mt-6 p-6 bg-gray-800 text-white rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Interactive Linear Regression Assumptions</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="N" className="block font-medium">Sample Size (N):</label>
          <input
            type="number"
            id="N"
            name="N"
            required
            className="input w-full p-2 rounded bg-gray-700 text-white"
            value={N}
            onChange={(e) => setN(parseInt(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="mu" className="block font-medium">Mean (μ):</label>
          <input
            type="number"
            step="any"
            id="mu"
            name="mu"
            required
            className="input w-full p-2 rounded bg-gray-700 text-white"
            value={mu}
            onChange={(e) => setMu(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="sigma2" className="block font-medium">Variance (σ²):</label>
          <input
            type="number"
            step="any"
            id="sigma2"
            name="sigma2"
            required
            className="input w-full p-2 rounded bg-gray-700 text-white"
            value={sigma2}
            onChange={(e) => setSigma2(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="S" className="block font-medium">Number of Simulations (S):</label>
          <input
            type="number"
            id="S"
            name="S"
            required
            className="input w-full p-2 rounded bg-gray-700 text-white"
            value={S}
            onChange={(e) => setS(parseInt(e.target.value))}
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
          Generate
        </button>
      </form>
      {submitted && (
        <div className="results mt-8">
          <h2 className="text-xl font-semibold mt-6">Generated Plot</h2>
          <div className="mt-4">
            <Scatter data={plotData1} options={{ scales: { x: { title: { display: true, text: 'X' } }, y: { title: { display: true, text: 'Y' } } } }} />
          </div>

          <h2 className="text-xl font-semibold mt-6">Histogram of Slopes</h2>
          <div className="mt-4">
            <Bar data={plotData2.slopeHistogramData} options={{ scales: { x: { title: { display: true, text: 'Slope Bins' } }, y: { title: { display: true, text: 'Frequency' } } } }} />
          </div>

          <h2 className="text-xl font-semibold mt-6">Histogram of Intercepts</h2>
          <div className="mt-4">
            <Bar data={plotData2.interceptHistogramData} options={{ scales: { x: { title: { display: true, text: 'Intercept Bins' } }, y: { title: { display: true, text: 'Frequency' } } } }} />
          </div>

          <p className="mt-4">Proportion of slopes more extreme than calculated slope: {slopeExtreme.toFixed(2)}%</p>
          <p>Proportion of intercepts more extreme than calculated intercept: {interceptExtreme.toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}

export default LinearRegressionAssumptions;
