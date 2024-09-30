import { Point, Centroid } from './types';

export enum InitializationMethod {
  Random = 'Random',
  FarthestFirst = 'Farthest First',
  KMeansPlusPlus = 'KMeans++',
  Manual = 'Manual',
}

export class KMeans {
  private k: number;
  private points: Point[];
  public centroids: Centroid[];
  private initializationMethod: InitializationMethod;

  constructor(k: number, points: Point[], initializationMethod: InitializationMethod) {
    this.k = k;
    this.points = points;
    this.initializationMethod = initializationMethod;
    this.centroids = [];
  }

  initializeCentroids() {
    switch (this.initializationMethod) {
      case InitializationMethod.Random:
        this.randomInitialization();
        break;
      case InitializationMethod.FarthestFirst:
        this.farthestFirstInitialization();
        break;
      case InitializationMethod.KMeansPlusPlus:
        this.kMeansPlusPlusInitialization();
        break;
      case InitializationMethod.Manual:
        // Centroids are set externally
        break;
      default:
        throw new Error('Unknown initialization method');
    }
  }

  private randomInitialization() {
    const shuffled = [...this.points].sort(() => 0.5 - Math.random());
    this.centroids = shuffled.slice(0, this.k).map(p => ({ x: p.x, y: p.y }));
  }

  private farthestFirstInitialization() {
    // Implementation of the Farthest First initialization
    const centroids: Centroid[] = [];
    const firstCentroid = this.points[Math.floor(Math.random() * this.points.length)];
    centroids.push({ x: firstCentroid.x, y: firstCentroid.y });

    while (centroids.length < this.k) {
      const distances = this.points.map(point => {
        const minDist = Math.min(
          ...centroids.map(c => this.euclideanDistance(point, c))
        );
        return { point, distance: minDist };
      });

      const farthest = distances.reduce((prev, curr) =>
        curr.distance > prev.distance ? curr : prev
      );

      centroids.push({ x: farthest.point.x, y: farthest.point.y });
    }

    this.centroids = centroids;
  }

  private kMeansPlusPlusInitialization() {
    // Implementation of the KMeans++ initialization
    const centroids: Centroid[] = [];
    const firstCentroid = this.points[Math.floor(Math.random() * this.points.length)];
    centroids.push({ x: firstCentroid.x, y: firstCentroid.y });

    while (centroids.length < this.k) {
      const distances = this.points.map(point => {
        const minDistSquared = Math.min(
          ...centroids.map(c => Math.pow(this.euclideanDistance(point, c), 2))
        );
        return minDistSquared;
      });

      const sumDistances = distances.reduce((sum, d) => sum + d, 0);
      const probabilities = distances.map(d => d / sumDistances);

      let cumulativeProbability = 0;
      const r = Math.random();
      for (let i = 0; i < probabilities.length; i++) {
        cumulativeProbability += probabilities[i];
        if (r < cumulativeProbability) {
          const point = this.points[i];
          centroids.push({ x: point.x, y: point.y });
          break;
        }
      }
    }

    this.centroids = centroids;
  }

  private euclideanDistance(a: Point | Centroid, b: Point | Centroid): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }

  assignPointsToClusters() {
    this.points.forEach(point => {
      let minDist = Infinity;
      let clusterIndex = -1;

      this.centroids.forEach((centroid, index) => {
        const dist = this.euclideanDistance(point, centroid);
        if (dist < minDist) {
          minDist = dist;
          clusterIndex = index;
        }
      });

      point.cluster = clusterIndex;
    });
  }

  updateCentroids() {
    this.centroids = this.centroids.map((_, index) => {
      const clusterPoints = this.points.filter(p => p.cluster === index);
      const numPoints = clusterPoints.length;

      if (numPoints === 0) return this.centroids[index];

      const sumX = clusterPoints.reduce((sum, p) => sum + p.x, 0);
      const sumY = clusterPoints.reduce((sum, p) => sum + p.y, 0);

      return {
        x: sumX / numPoints,
        y: sumY / numPoints,
      };
    });
  }

  hasConverged(oldCentroids: Centroid[], newCentroids: Centroid[]): boolean {
    for (let i = 0; i < oldCentroids.length; i++) {
      if (this.euclideanDistance(oldCentroids[i], newCentroids[i]) > 1e-6) {
        return false;
      }
    }
    return true;
  }

  iterate(): boolean {
    const oldCentroids = JSON.parse(JSON.stringify(this.centroids));
    this.assignPointsToClusters();
    this.updateCentroids();
    return this.hasConverged(oldCentroids, this.centroids);
  }

  getCentroids(): Centroid[] {
    return this.centroids;
  }

  getPoints(): Point[] {
    return this.points;
  }
}