import React, { useState, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';

interface FrameData {
  X: number[][];
  y: number[];
  hiddenActivations: number[][];
  outputActivations: number[];
  W1: number[][];
  W2: number[];
  b1: number[];
  b2: number;
  dW1: number[][];
  dW2: number[];
}

function NeuralNetworkVisualization() {
  const [activation, setActivation] = useState<string>('tanh');
  const [lr, setLr] = useState<number>(1);
  const [stepNum, setStepNum] = useState<number>(1000);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [frames, setFrames] = useState<FrameData[]>([]);
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const animationInterval = useRef<number | null>(null);

  const activations = ['tanh', 'relu', 'sigmoid'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activations.includes(activation)) {
      alert('Please choose from relu, tanh, sigmoid.');
      return;
    }
    if (lr <= 0) {
      alert('Learning rate must be positive.');
      return;
    }
    if (stepNum <= 0) {
      alert('Number of training steps must be positive.');
      return;
    }
    generateVisualization();
  };

  function randn_bm(): number {
    let u = 0,
      v = 0;
    while (u === 0) u = Math.random(); // Converting [0,1) to (0,1]
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  function generateData(nSamples: number = 100): { X: number[][]; y: number[] } {
    const X: number[][] = [];
    const y: number[] = [];
    for (let i = 0; i < nSamples; i++) {
      const x1 = randn_bm();
      const x2 = randn_bm();
      X.push([x1, x2]);
      const label = x1 * x1 + x2 * x2 > 1 ? 1 : 0; // Circular boundary
      y.push(label);
    }
    return { X, y };
  }

  class MLP {
    inputDim: number;
    hiddenDim: number;
    outputDim: number;
    lr: number;
    activationFn: string;
    W1: number[][];
    b1: number[];
    W2: number[];
    b2: number;
    a1: number[][];
    z1: number[][];
    a2: number[];
    z2: number[];
    dW1: number[][];
    db1: number[];
    dW2: number[];
    db2: number;

    constructor(inputDim: number, hiddenDim: number, outputDim: number, lr: number, activation: string) {
      this.inputDim = inputDim;
      this.hiddenDim = hiddenDim;
      this.outputDim = outputDim;
      this.lr = lr;
      this.activationFn = activation;

      // Initialize weights and biases
      this.W1 = this.randomMatrix(inputDim, hiddenDim, 0.1);
      this.b1 = Array(hiddenDim).fill(0);
      this.W2 = this.randomArray(hiddenDim, 0.1);
      this.b2 = 0;

      // Initialize other variables
      this.a1 = [];
      this.z1 = [];
      this.a2 = [];
      this.z2 = [];
      this.dW1 = [];
      this.db1 = [];
      this.dW2 = [];
      this.db2 = 0;
    }

    randomMatrix(rows: number, cols: number, scale: number): number[][] {
      const mat: number[][] = [];
      for (let i = 0; i < rows; i++) {
        mat.push([]);
        for (let j = 0; j < cols; j++) {
          mat[i].push((Math.random() * 2 - 1) * scale);
        }
      }
      return mat;
    }

    randomArray(size: number, scale: number): number[] {
      const arr: number[] = [];
      for (let i = 0; i < size; i++) {
        arr.push((Math.random() * 2 - 1) * scale);
      }
      return arr;
    }

    activation(z: number): number {
      if (this.activationFn === 'tanh') {
        return Math.tanh(z);
      } else if (this.activationFn === 'relu') {
        return Math.max(0, z);
      } else if (this.activationFn === 'sigmoid') {
        return 1 / (1 + Math.exp(-z));
      } else {
        throw new Error('Unsupported activation function');
      }
    }

    activationDerivative(z: number): number {
      if (this.activationFn === 'tanh') {
        const t = Math.tanh(z);
        return 1 - t * t;
      } else if (this.activationFn === 'relu') {
        return z > 0 ? 1 : 0;
      } else if (this.activationFn === 'sigmoid') {
        const s = 1 / (1 + Math.exp(-z));
        return s * (1 - s);
      } else {
        throw new Error('Unsupported activation function');
      }
    }

    forward(X: number[][]): number[] {
      const m = X.length;
      this.z1 = [];
      this.a1 = [];
      for (let i = 0; i < m; i++) {
        const z1_i: number[] = [];
        for (let j = 0; j < this.hiddenDim; j++) {
          let sum = this.b1[j];
          for (let k = 0; k < this.inputDim; k++) {
            sum += X[i][k] * this.W1[k][j];
          }
          z1_i.push(sum);
        }
        this.z1.push(z1_i);

        const a1_i = z1_i.map(z => this.activation(z));
        this.a1.push(a1_i);
      }

      this.z2 = [];
      this.a2 = [];
      for (let i = 0; i < m; i++) {
        let sum = this.b2;
        for (let j = 0; j < this.hiddenDim; j++) {
          sum += this.a1[i][j] * this.W2[j];
        }
        this.z2.push(sum);
        this.a2.push(1 / (1 + Math.exp(-sum))); // Sigmoid activation
      }

      return this.a2;
    }

    backward(X: number[][], y: number[]) {
      const m = X.length;

      // Initialize gradients
      this.dW1 = [];
      for (let i = 0; i < this.inputDim; i++) {
        this.dW1.push(Array(this.hiddenDim).fill(0));
      }
      this.db1 = Array(this.hiddenDim).fill(0);
      this.dW2 = Array(this.hiddenDim).fill(0);
      this.db2 = 0;

      for (let i = 0; i < m; i++) {
        const dz2 = this.a2[i] - y[i]; // scalar
        for (let j = 0; j < this.hiddenDim; j++) {
          this.dW2[j] += this.a1[i][j] * dz2 / m;
        }
        this.db2 += dz2 / m;

        const da1 = [];
        for (let j = 0; j < this.hiddenDim; j++) {
          da1.push(this.W2[j] * dz2);
        }

        for (let j = 0; j < this.hiddenDim; j++) {
          const dz1 = da1[j] * this.activationDerivative(this.z1[i][j]);
          for (let k = 0; k < this.inputDim; k++) {
            this.dW1[k][j] += X[i][k] * dz1 / m;
          }
          this.db1[j] += dz1 / m;
        }
      }

      // Update weights and biases
      for (let i = 0; i < this.inputDim; i++) {
        for (let j = 0; j < this.hiddenDim; j++) {
          this.W1[i][j] -= this.lr * this.dW1[i][j];
        }
      }
      for (let j = 0; j < this.hiddenDim; j++) {
        this.b1[j] -= this.lr * this.db1[j];
        this.W2[j] -= this.lr * this.dW2[j];
      }
      this.b2 -= this.lr * this.db2;
    }
  }

  function generateVisualization() {
    const { X, y } = generateData(200);

    const mlp = new MLP(2, 3, 1, lr, activation);

    const framesData: FrameData[] = [];

    const stepsPerFrame = 10;
    const totalFrames = Math.floor(stepNum / stepsPerFrame);

    for (let frame = 0; frame < totalFrames; frame++) {
      for (let step = 0; step < stepsPerFrame; step++) {
        mlp.forward(X);
        mlp.backward(X, y);
      }
      // Store data for visualization
      framesData.push({
        X: X.map(item => [...item]),
        y: [...y],
        hiddenActivations: mlp.a1.map(item => [...item]),
        outputActivations: [...mlp.a2],
        W1: mlp.W1.map(row => [...row]),
        W2: [...mlp.W2],
        b1: [...mlp.b1],
        b2: mlp.b2,
        dW1: mlp.dW1.map(row => [...row]),
        dW2: [...mlp.dW2],
      });
    }

    setFrames(framesData);
    setSubmitted(true);
    setCurrentFrame(0);
    setIsAnimating(true);
  }

  useEffect(() => {
    if (isAnimating && frames.length > 0) {
      animationInterval.current = window.setInterval(() => {
        setCurrentFrame(prevFrame => {
          if (prevFrame < frames.length - 1) {
            return prevFrame + 1;
          } else {
            if (animationInterval.current !== null) {
              clearInterval(animationInterval.current);
              setIsAnimating(false);
            }
            return prevFrame;
          }
        });
      }, 50);
      return () => {
        if (animationInterval.current !== null) clearInterval(animationInterval.current);
      };
    }
  }, [isAnimating, frames]);

  const currentData: FrameData | undefined = frames[currentFrame];

  // Visualization functions
  function plotDecisionBoundary() {
    if (!currentData) return null;

    // Generate grid points
    const xMin = -3,
      xMax = 3,
      yMin = -3,
      yMax = 3,
      h = 0.1;
    const xx: number[] = [];
    const yy: number[] = [];
    for (let x = xMin; x <= xMax; x += h) {
      for (let y = yMin; y <= yMax; y += h) {
        xx.push(x);
        yy.push(y);
      }
    }
    const gridPoints = xx.map((x, i) => [x, yy[i]]);
    const gridOutputs = mlpForward(currentData, gridPoints);

    return (
      <Plot
        data={[
          {
            x: currentData.X.map((p: number[]) => p[0]),
            y: currentData.X.map((p: number[]) => p[1]),
            mode: 'markers',
            type: 'scatter',
            marker: { color: currentData.y.map((label: number) => (label === 1 ? 'red' : 'blue')) },
            name: 'Data Points',
          },
          {
            x: xx,
            y: yy,
            z: gridOutputs,
            type: 'contour',
            contours: {
              coloring: 'lines',
              showlabels: false,
              start: 0.5,
              end: 0.5,
              size: 0.5,
            },
            showscale: false,
            line: { color: 'green' },
            name: 'Decision Boundary',
          },
        ]}
        layout={{
          autosize: true,
          height: 400,
          template: 'plotly_dark' as any, // Cast to 'any' to fix TypeScript error
          title: 'Decision Boundary in Input Space',
          xaxis: { title: 'Feature 1' },
          yaxis: { title: 'Feature 2' },
        }}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
      />
    );
  }

  function mlpForward(data: FrameData, X: number[][]): number[] {
    const m = X.length;
    const z1: number[][] = [];
    const a1: number[][] = [];
    for (let i = 0; i < m; i++) {
      const z1_i: number[] = [];
      for (let j = 0; j < data.W1[0].length; j++) {
        let sum = data.b1[j];
        for (let k = 0; k < data.W1.length; k++) {
          sum += X[i][k] * data.W1[k][j];
        }
        z1_i.push(sum);
      }
      z1.push(z1_i);

      const a1_i = z1_i.map(z => activationFunction(z, activation));
      a1.push(a1_i);
    }

    const z2: number[] = [];
    const a2: number[] = [];
    for (let i = 0; i < m; i++) {
      let sum = data.b2;
      for (let j = 0; j < data.W2.length; j++) {
        sum += a1[i][j] * data.W2[j];
      }
      z2.push(sum);
      a2.push(1 / (1 + Math.exp(-sum))); // Sigmoid activation
    }

    return a2;
  }

  function activationFunction(z: number, activationFn: string): number {
    if (activationFn === 'tanh') {
      return Math.tanh(z);
    } else if (activationFn === 'relu') {
      return Math.max(0, z);
    } else if (activationFn === 'sigmoid') {
      return 1 / (1 + Math.exp(-z));
    } else {
      throw new Error('Unsupported activation function');
    }
  }

  function plotHiddenActivations() {
    if (!currentData) return null;

    const hiddenDim = currentData.hiddenActivations[0].length;

    if (hiddenDim >= 3) {
      // 3D Plot
      return (
        <Plot
          data={[
            {
              x: currentData.hiddenActivations.map((h: number[]) => h[0]),
              y: currentData.hiddenActivations.map((h: number[]) => h[1]),
              z: currentData.hiddenActivations.map((h: number[]) => h[2]),
              mode: 'markers',
              type: 'scatter3d',
              marker: {
                color: currentData.y.map((label: number) => (label === 1 ? 'red' : 'blue')),
                size: 3,
              },
            },
          ]}
          layout={{
            autosize: true,
            height: 400,
            template: 'plotly_dark' as any, // Cast to 'any' to fix TypeScript error
            title: 'Hidden Layer Feature Space',
            scene: {
              xaxis: { title: 'Neuron 1 Activation' },
              yaxis: { title: 'Neuron 2 Activation' },
              zaxis: { title: 'Neuron 3 Activation' },
            },
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
        />
      );
    } else if (hiddenDim === 2) {
      // 2D Plot
      return (
        <Plot
          data={[
            {
              x: currentData.hiddenActivations.map((h: number[]) => h[0]),
              y: currentData.hiddenActivations.map((h: number[]) => h[1]),
              mode: 'markers',
              type: 'scatter',
              marker: {
                color: currentData.y.map((label: number) => (label === 1 ? 'red' : 'blue')),
              },
            },
          ]}
          layout={{
            autosize: true,
            height: 400,
            template: 'plotly_dark' as any, // Cast to 'any' to fix TypeScript error
            title: 'Hidden Layer Feature Space',
            xaxis: { title: 'Neuron 1 Activation' },
            yaxis: { title: 'Neuron 2 Activation' },
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
        />
      );
    } else if (hiddenDim === 1) {
      // 1D Plot
      return (
        <Plot
          data={[
            {
              x: currentData.hiddenActivations.map((h: number[]) => h[0]),
              y: currentData.y,
              mode: 'markers',
              type: 'scatter',
              marker: {
                color: currentData.y.map((label: number) => (label === 1 ? 'red' : 'blue')),
              },
            },
          ]}
          layout={{
            autosize: true,
            height: 400,
            template: 'plotly_dark' as any, // Cast to 'any' to fix TypeScript error
            title: 'Hidden Layer Feature Space',
            xaxis: { title: 'Neuron 1 Activation' },
            yaxis: { title: 'Label' },
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
        />
      );
    } else {
      return null;
    }
  }

  function plotGradientVisualization() {
    if (!currentData) return null;

    const nodes = {
      input: [{ x: 0, y: 1 }, { x: 0, y: -1 }],
      hidden: currentData.W1[0].map((_: any, i: number) => ({ x: 1, y: i })),
      output: [{ x: 2, y: 0 }],
    };

    const edges: any[] = [];

    // Input to Hidden
    for (let i = 0; i < nodes.input.length; i++) {
      for (let j = 0; j < nodes.hidden.length; j++) {
        const weight_grad = Math.abs(currentData.dW1[i][j]);
        edges.push({
          x: [nodes.input[i].x, nodes.hidden[j].x],
          y: [nodes.input[i].y, nodes.hidden[j].y],
          mode: 'lines',
          line: { width: weight_grad * 1000, color: 'gray' },
          hoverinfo: 'none',
        });
      }
    }

    // Hidden to Output
    for (let i = 0; i < nodes.hidden.length; i++) {
      const weight_grad = Math.abs(currentData.dW2[i]);
      edges.push({
        x: [nodes.hidden[i].x, nodes.output[0].x],
        y: [nodes.hidden[i].y, nodes.output[0].y],
        mode: 'lines',
        line: { width: weight_grad * 1000, color: 'gray' },
        hoverinfo: 'none',
      });
    }

    const nodeTrace = {
      x: [...nodes.input.map(n => n.x), ...nodes.hidden.map(n => n.x), nodes.output[0].x],
      y: [...nodes.input.map(n => n.y), ...nodes.hidden.map(n => n.y), nodes.output[0].y],
      mode: 'markers+text',
      type: 'scatter',
      marker: { size: 20, color: 'blue' },
      text: ['Input 1', 'Input 2', ...nodes.hidden.map((_: any, i: number) => `Hidden ${i + 1}`), 'Output'],
      textposition: 'top center',
    };

    return (
      <Plot
        data={[nodeTrace, ...edges]}
        layout={{
          autosize: true,
          height: 400,
          template: 'plotly_dark' as any, // Cast to 'any' to fix TypeScript error
          title: 'Neural Net Visualization',
          xaxis: { visible: false },
          yaxis: { visible: false },
          showlegend: false,
        }}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
      />
    );
  }

  return (
    <div className="mt-6 p-6 bg-gray-800 text-white rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Interactive Neural Network Visualization</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="activation" className="block font-medium">
            Activation Function:
          </label>
          <select
            id="activation"
            name="activation"
            required
            className="input w-full p-2 rounded bg-gray-700 text-white"
            value={activation}
            onChange={e => setActivation(e.target.value)}
          >
            <option value="tanh">Tanh</option>
            <option value="relu">ReLU</option>
            <option value="sigmoid">Sigmoid</option>
          </select>
        </div>
        <div>
          <label htmlFor="lr" className="block font-medium">
            Learning Rate:
          </label>
          <input
            type="number"
            step="any"
            id="lr"
            name="lr"
            required
            className="input w-full p-2 rounded bg-gray-700 text-white"
            value={lr}
            onChange={e => setLr(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="step_num" className="block font-medium">
            Number of Training Steps:
          </label>
          <input
            type="number"
            id="step_num"
            name="step_num"
            required
            className="input w-full p-2 rounded bg-gray-700 text-white"
            value={stepNum}
            onChange={e => setStepNum(parseInt(e.target.value))}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Train and Visualize
        </button>
      </form>

      {submitted && (
        <div className="results mt-8">
          <h2 className="text-xl font-semibold mt-6">Training Animation</h2>
          <p className="mt-2">
            Frame {currentFrame + 1} of {frames.length}
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4" style={{ height: '500px' }}>
            {plotDecisionBoundary()}
            {plotHiddenActivations()}
            {plotGradientVisualization()}
          </div>
        </div>
      )}
    </div>
  );
}

export default NeuralNetworkVisualization;
