import {
  ModelAccuracy,
  FalsePositiveRate,
  FalseNegativeRate,
  ConfidenceDistribution,
  PredictionDriftData,
} from "../types/ai-model-monitoring";

export const modelAccuracy: ModelAccuracy = {
  accuracyRate: 94.7,
  truePositives: 12453,
  trueNegatives: 87234,
  totalPredictions: 105687,
  change: "+1.2%",
};

export const falsePositiveRate: FalsePositiveRate = {
  rate: 2.3,
  falsePositives: 1987,
  safeJobsMarked: 87234,
  change: "-0.5%",
};

export const falseNegativeRate: FalseNegativeRate = {
  rate: 3.0,
  falseNegatives: 2587,
  scamsMarkedSafe: 12453,
  change: "+0.3%",
};

export const confidenceDistribution: ConfidenceDistribution = {
  averageConfidence: 0.87,
  buckets: [
    { range: "0.0-0.2", count: 234, percentage: 0.2, accuracy: 45.2 },
    { range: "0.2-0.4", count: 567, percentage: 0.5, accuracy: 62.8 },
    { range: "0.4-0.6", count: 1234, percentage: 1.2, accuracy: 78.5 },
    { range: "0.6-0.8", count: 5678, percentage: 5.4, accuracy: 89.2 },
    { range: "0.8-1.0", count: 97974, percentage: 92.7, accuracy: 96.8 },
  ],
};

export const predictionDriftData: PredictionDriftData[] = [
  { date: "Jan 1", accuracy: 93.2, falsePositiveRate: 2.8, falseNegativeRate: 4.0 },
  { date: "Jan 2", accuracy: 93.5, falsePositiveRate: 2.7, falseNegativeRate: 3.8 },
  { date: "Jan 3", accuracy: 93.8, falsePositiveRate: 2.6, falseNegativeRate: 3.6 },
  { date: "Jan 4", accuracy: 93.4, falsePositiveRate: 2.9, falseNegativeRate: 3.7 },
  { date: "Jan 5", accuracy: 93.9, falsePositiveRate: 2.5, falseNegativeRate: 3.6 },
  { date: "Jan 6", accuracy: 94.1, falsePositiveRate: 2.4, falseNegativeRate: 3.5 },
  { date: "Jan 7", accuracy: 94.0, falsePositiveRate: 2.5, falseNegativeRate: 3.5 },
  { date: "Jan 8", accuracy: 94.3, falsePositiveRate: 2.3, falseNegativeRate: 3.4 },
  { date: "Jan 9", accuracy: 94.2, falsePositiveRate: 2.4, falseNegativeRate: 3.4 },
  { date: "Jan 10", accuracy: 94.5, falsePositiveRate: 2.2, falseNegativeRate: 3.3 },
  { date: "Jan 11", accuracy: 94.4, falsePositiveRate: 2.3, falseNegativeRate: 3.3 },
  { date: "Jan 12", accuracy: 94.6, falsePositiveRate: 2.2, falseNegativeRate: 3.2 },
  { date: "Jan 13", accuracy: 94.5, falsePositiveRate: 2.3, falseNegativeRate: 3.2 },
  { date: "Jan 14", accuracy: 94.7, falsePositiveRate: 2.1, falseNegativeRate: 3.2 },
  { date: "Jan 15", accuracy: 94.6, falsePositiveRate: 2.2, falseNegativeRate: 3.1 },
  { date: "Jan 16", accuracy: 94.8, falsePositiveRate: 2.0, falseNegativeRate: 3.2 },
  { date: "Jan 17", accuracy: 94.7, falsePositiveRate: 2.1, falseNegativeRate: 3.1 },
  { date: "Jan 18", accuracy: 94.9, falsePositiveRate: 1.9, falseNegativeRate: 3.2 },
  { date: "Jan 19", accuracy: 94.8, falsePositiveRate: 2.0, falseNegativeRate: 3.1 },
  { date: "Jan 20", accuracy: 94.7, falsePositiveRate: 2.1, falseNegativeRate: 3.2 },
  { date: "Jan 21", accuracy: 94.6, falsePositiveRate: 2.2, falseNegativeRate: 3.2 },
  { date: "Jan 22", accuracy: 94.8, falsePositiveRate: 2.0, falseNegativeRate: 3.1 },
  { date: "Jan 23", accuracy: 94.7, falsePositiveRate: 2.1, falseNegativeRate: 3.2 },
  { date: "Jan 24", accuracy: 94.9, falsePositiveRate: 1.9, falseNegativeRate: 3.1 },
  { date: "Jan 25", accuracy: 94.8, falsePositiveRate: 2.0, falseNegativeRate: 3.2 },
  { date: "Jan 26", accuracy: 94.7, falsePositiveRate: 2.1, falseNegativeRate: 3.1 },
  { date: "Jan 27", accuracy: 94.6, falsePositiveRate: 2.2, falseNegativeRate: 3.2 },
  { date: "Jan 28", accuracy: 94.8, falsePositiveRate: 2.0, falseNegativeRate: 3.1 },
  { date: "Jan 29", accuracy: 94.7, falsePositiveRate: 2.1, falseNegativeRate: 3.2 },
  { date: "Jan 30", accuracy: 94.7, falsePositiveRate: 2.3, falseNegativeRate: 3.0 },
];
